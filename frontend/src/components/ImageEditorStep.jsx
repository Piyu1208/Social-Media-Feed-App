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
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-3 sm:px-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-lg font-semibold text-white">
            Edit photos
          </h1>

          {/* balances the layout */}
          <div className="w-[72px]" />
        </header>

        {/* Editor */}
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-3xl bg-neutral p-5 shadow-2xl ring-1 ring-white/10">
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
        <footer className="mt-6 flex justify-center">
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