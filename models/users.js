import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user", enum: ["user", "admin"] },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    phone: { type: String, default: "" },
    pin: { type: String, default: "" },
    area: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
