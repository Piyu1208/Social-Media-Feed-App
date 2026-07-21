import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    caption: {
        type: String,
        trim: true,
        maxLength: 300,
    },
    
    images: [{
        _id: false,

        public_id: {
            type: String,
            default: "",
        },

        url: {
            type: String,
            default: "",
        },
    }], 

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    commentCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;