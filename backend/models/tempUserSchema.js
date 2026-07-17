import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tempUserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    otp: {
        type: String,
        required: true,
        select: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800
    }, 

    isVerified: {
        type: Boolean,
        default: false,
    },
});

tempUserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

    this.otp = await bcrypt.hash(this.otp, 10);
});

tempUserSchema.methods.correctOTP = async function (currentOTP) {
    return await bcrypt.compare(currentOTP, this.otp);
};

const TempUser = mongoose.model('TempUser', tempUserSchema);

export default TempUser;