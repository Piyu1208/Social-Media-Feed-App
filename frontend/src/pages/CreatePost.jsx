import { useState } from "react";
import ImageUploadStep from "../components/ImageUploadStep";
import ImageEditorStep from "../components/ImageEditorStep";
import CaptionStep from "../components/CaptionStep";
import { getCroppedImage } from "../utils/cropImage";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function CreatePost() {
  const [step, setStep] = useState("upload");

  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const handleCreatePost = async () => {
    console.log("Publish clicked");
    try {
      setError(null);

      if (caption.trim() === "") {
        setError("Caption cannot be empty.");
        return;
      }

      setIsPosting(true);

      const formData = new FormData();
      formData.append("caption", caption);

      images.forEach((image) => {
        formData.append("images", 
          image.croppedFile ?? image.file
        );
      });

      const res = await api.post("/posts", formData);

      console.log(res);

      setCaption("");
      setImages([]);
      navigate("/");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];

    const formatted = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),

      crop: {
        x: 0,
        y: 0,
      },

      zoom: 1,
      rotation: 0,

      croppedAreaPixels: null,
    }));

    setImages(formatted);
    setStep("editor");
  };

  const handleCroppedImageNext = async () => {
    const processedImages = await Promise.all(
      images.map(async (image) => {
        const cropped = await getCroppedImage(
          image.preview,
          image.croppedAreaPixels,
        );

        return {
          ...image,
          croppedPreview: cropped.url,
          croppedFile: cropped.file,
        };
      }),
    );

    setImages(processedImages);

    setStep("caption");
  };

  return (
    <>
      {step === "upload" && <ImageUploadStep onSelect={handleImageChange} />}

        {step === "editor" && (
          <ImageEditorStep
            images={images}
            setImages={setImages}
            currentImage={currentImage}
            setCurrentImage={setCurrentImage}
            onNext={handleCroppedImageNext}
            onBack={() => setStep("upload")}
          />
        )}

      {step === "caption" && (
         <div className="mx-auto w-full max-w-2xl">
        <CaptionStep
          caption={caption}
          setCaption={setCaption}
          images={images}
          isPosting={isPosting}
          onBack={() => setStep("editor")}
          onSubmit={handleCreatePost}
        />
        </div>
      )}
    </>
  );
}
