import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    public_id: {
        type: String,
        default: "",
    },

    url: {
        type: String,
        default: "",
    }, 
}, {
    _id: false,
});

const Image = mongoose.model("Image", imageSchema);

export default Image;