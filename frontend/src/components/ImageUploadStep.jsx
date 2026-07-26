import { ImagePlus } from "lucide-react";

export default function ImageUploadStep({ onSelect }) {
  return (
    <>
      <div className="mx-auto w-full max-w-md px-4 sm:px-0">
        <div className="my-8 text-center">
          <p className="mt-2 text-sm text-zinc-500">
            Start by selecting the photos you'd like to share.
          </p>
        </div>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-8 py-12 transition-colors hover:border-zinc-300 hover:bg-zinc-100">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <ImagePlus className="h-6 w-6 text-zinc-500" />
          </div>

          <h2 className="text-base font-semibold text-zinc-900">
            Upload photos
          </h2>

          <p className="mt-1 text-center text-sm text-zinc-500">
            Drag & drop or click to select images
          </p>

          <input
            hidden
            multiple
            accept="image/*"
            type="file"
            onChange={onSelect}
          />
        </label>
      </div>
    </>
  );
}
