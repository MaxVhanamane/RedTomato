import mongoose from 'mongoose';

const ForgotPasswordTokenSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    token: { type: String, required: true },
    expiresIn: { type: Number, required: true },
}, { timestamps: true });

// Auto-delete token documents after 10 minutes
ForgotPasswordTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const ForgotPasswordToken = mongoose.models.ForgotPasswordToken || mongoose.model("ForgotPasswordToken", ForgotPasswordTokenSchema);

export default ForgotPasswordToken;
