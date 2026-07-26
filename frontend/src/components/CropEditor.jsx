import Cropper from "react-easy-crop";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CropEditor({
  image,
  images,
  setImages,
  currentImage,
  setCurrentImage,
}) {
  return (
    <div className="space-y-6">
      {/* Crop Area */}
      <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 md:h-90 md:w-90 overflow-hidden border-zinc-200 bg-neutral">
        <Cropper
          zoomWithScroll
          image={image.preview}
          crop={image.crop}
          zoom={image.zoom}
          aspect={1}
          rotation={image.rotation}
          objectFit="cover"
          //showGrid={false}
          onCropChange={(crop) => {
            setImages((prev) =>
              prev.map((img, index) =>
                index === currentImage ? { ...img, crop } : img
              )
            );
          }}
          onZoomChange={(zoom) => {
            setImages((prev) =>
              prev.map((img, index) =>
                index === currentImage ? { ...img, zoom } : img
              )
            );
          }}
          onCropComplete={(_, croppedAreaPixels) => {
            setImages((prev) =>
              prev.map((img, index) =>
                index === currentImage
                  ? { ...img, croppedAreaPixels }
                  : img
              )
            );
          }}
        />

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/50 px-3 py-1 backdrop-blur">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 w-2 rounded-full transition ${
                  currentImage === index
                    ? "bg-white"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Zoom */}
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center gap-4">
          <span className="w-12 text-sm text-zinc-500">Zoom</span>

          <input
            className="w-full accent"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={image.zoom}
            onChange={(e) => {
              const zoom = Number(e.target.value);

              setImages((prev) =>
                prev.map((img, index) =>
                  index === currentImage ? { ...img, zoom } : img
                )
              );
            }}
          />
        </div>
      </div>

      {/* Previous / Next */}
      {images.length > 1 && (
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          <button
            onClick={() =>
              setCurrentImage((i) => Math.max(i - 1, 0))
            }
            disabled={currentImage === 0}
            className="rounded-full border border-zinc-200 p-2 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm text-zinc-500">
            {currentImage + 1} of {images.length}
          </span>

          <button
            onClick={() =>
              setCurrentImage((i) =>
                Math.min(i + 1, images.length - 1)
              )
            }
            disabled={currentImage === images.length - 1}
            className="rounded-full border border-zinc-200 p-2 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}