import { useState } from "react";

export default function CreatePost({ caption, setCaption, images, setImages, handleSubmit, handleImageChange }) {

    return (
        <div>
            <form>
                <textarea 
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={4}
                />

                <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />

                <div>
                    {images.map((image, index) => (
                        <img 
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt=""
                        className="preview"
                        />
                    ))}
                </div>


                <button onClick={handleSubmit}>
                    Post
                </button>
            </form>
        </div>
    );
}