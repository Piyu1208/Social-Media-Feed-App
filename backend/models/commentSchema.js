import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    text: {
        type: String,
        trim: true,
        maxLength: 100,
        required: true,
    },

}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;