import { ArrowLeft } from "lucide-react";
import CropEditor from "./CropEditor";

export default function ImageEditorStep({
  images,
  setImages,
  currentImage,
  setCurrentImage,
  onBack,
  onNext,
}) {
  const image = images[currentImage];

  return (
    <div className="h-full overflow-hidden bg-neutral-950">
      <div className="mx-auto grid h-full max-w-xl grid-rows-[auto_1fr_auto] gap-3 px-4 py-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl px-3 py-4 text-sm font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <p className="mt-1 text-xs text-neutral-400">
            Drag to reposition • Pinch to zoom
          </p>

          <div className="w-[72px]" />
        </header>

        {/* Editor */}
        <main className="min-h-0">
          <div className="flex h-full flex-col rounded bg-neutral-900 p-4 shadow-2xl ring-1 ring-white/10">
            <CropEditor
              image={image}
              images={images}
              setImages={setImages}
              currentImage={currentImage}
              setCurrentImage={setCurrentImage}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="flex justify-center mt-8">
          <button
            onClick={onNext}
            className="w-full max-w-md rounded-2xl bg-white py-3.5 font-medium text-black transition hover:bg-neutral-200 active:scale-[0.99]"
          >
            Continue
          </button>
        </footer>
      </div>
    </div>
  );
}
