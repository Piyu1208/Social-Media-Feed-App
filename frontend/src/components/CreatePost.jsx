import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { X, Loader2 } from "lucide-react";

export default function CreatePost({
  caption,
  setCaption,
  images,
  handleSubmit,
  handleImageChange,
  handleRemoveImage,
  isPosting,
}) {
  const MAX_CHARACTERS = 120;

  return (
    <>
      {/* Image Preview */}
      {images.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              📷 {images.length} {images.length === 1 ? "image" : "images"}{" "}
              selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Image number */}
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-semibold text-white">
                  {index + 1}
                </span>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isPosting}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-red-500 focus:outline-none"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <FieldGroup className="space-y-5">
          <Field>
            <textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={5}
              disabled={isPosting}
              maxLength={MAX_CHARACTERS}
              className="min-h-[140px] w-full rounded-lg border bg-background p-3 text-sm outline-none transition focus:ring-2 focus:ring-primary"
            />

            <div className="mt-2 flex justify-end">
              <span
                className={`text-xs ${
                  caption.length > MAX_CHARACTERS * 0.9
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {caption.length}/{MAX_CHARACTERS}
              </span>
            </div>
          </Field>

          <Field>
            <Input
              className={`${isPosting ? "pointer-events-none opacity-60" : ""}`}
              type="file"
              accept="image/*"
              multiple
              disabled={isPosting}
              onChange={handleImageChange}
            />
          </Field>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPosting}
              className="w-full sm:w-auto sm:min-w-[140px]"
            >
              {isPosting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </>
  );
}
