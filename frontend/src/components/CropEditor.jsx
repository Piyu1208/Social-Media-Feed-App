import Cropper from "react-easy-crop";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function CropEditor({
  image,
  images,
  setImages,
  currentImage,
  setCurrentImage,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Flexible Crop Area */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          className="
              relative
    aspect-square
    w-[85vw]
    max-w-[420px]
    max-h-[45dvh]
    overflow-hidden
    rounded
    bg-neutral-950
    ring-1
    ring-white/10
  "
        >
          <Cropper
            zoomWithScroll
            image={image.preview}
            crop={image.crop}
            zoom={image.zoom}
            aspect={1}
            rotation={image.rotation}
            objectFit="cover"
            onCropChange={(crop) => {
              setImages((prev) =>
                prev.map((img, index) =>
                  index === currentImage ? { ...img, crop } : img,
                ),
              );
            }}
            onZoomChange={(zoom) => {
              setImages((prev) =>
                prev.map((img, index) =>
                  index === currentImage ? { ...img, zoom } : img,
                ),
              );
            }}
            onCropComplete={(_, croppedAreaPixels) => {
              setImages((prev) =>
                prev.map((img, index) =>
                  index === currentImage ? { ...img, croppedAreaPixels } : img,
                ),
              );
            }}
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/50 px-3 py-1 backdrop-blur">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    currentImage === index ? "w-6 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Image Navigation & Help */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between py-4 mt-3">
        <button
          onClick={() => setCurrentImage((i) => Math.max(i - 1, 0))}
          disabled={currentImage === 0}
          className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          {images.length > 1 && (
            <p className="text-sm font-medium text-white">
              {currentImage + 1} of {images.length}
            </p>
          )}
        </div>

        <button
          onClick={() =>
            setCurrentImage((i) => Math.min(i + 1, images.length - 1))
          }
          disabled={currentImage === images.length - 1}
          className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Fixed Controls */}
     {/* <div className="mx-auto w-full max-w-md py-2">
        <div className="flex items-center gap-4">
          <Minus size={16} />

          <input
            className="w-full cursor-pointer accent-white"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={image.zoom}
            onChange={(e) => {
              const zoom = Number(e.target.value);

              setImages((prev) =>
                prev.map((img, index) =>
                  index === currentImage ? { ...img, zoom } : img,
                ),
              );
            }}
          />

          <Plus size={16} />
        </div>
      </div>*/}
    </div>
  );
}
