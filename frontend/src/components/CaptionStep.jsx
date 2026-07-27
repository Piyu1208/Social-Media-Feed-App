import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function CaptionStep({
  caption,
  setCaption,
  images,
  onBack,
  onSubmit,
  isPosting,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollLeft, clientWidth } = e.target;
    setCurrentImage(Math.round(scrollLeft / clientWidth));
  };

  const scrollToImage = (index) => {
    if (!scrollRef.current) return;

    const width = scrollRef.current.clientWidth;

    scrollRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });

    setCurrentImage(index);
  };

  const handlePrev = () => {
    if (currentImage > 0) {
      scrollToImage(currentImage - 1);
    }
  };

  const handleNext = () => {
    if (currentImage < images.length - 1) {
      scrollToImage(currentImage + 1);
    }
  };

  return (
    <div className="mx-auto w-md max-w-md space-y-4 px-6">
      {/* Header */}
      <div className="flex items-center justify-between my-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h2 className="font-semibold">Review Post</h2>

        <div className="w-14" />
      </div>

      {/* Preview */}
      <div className="mx-auto w-full max-w-xl overflow-hidden border bg-background shadow-sm">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth
               [-ms-overflow-style:none]
               [scrollbar-width:none]
               [&::-webkit-scrollbar]:hidden"
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image.croppedPreview ?? image.preview}
                alt=""
                className="aspect-square w-full flex-shrink-0 object-cover"
              />
            ))}
          </div>

          {images.length > 1 && currentImage > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {images.length > 1 && currentImage < images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    currentImage === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4 p-5">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full resize-none border-none bg-transparent text-md outline-none"
          />
          <div className="text-right text-xs text-muted-foreground">
            {caption.length}/300
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isPosting}
        className="w-full rounded-2xl bg-black py-3.5 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
      >
        {isPosting ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
}
