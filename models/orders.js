import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    orderId: { type: String, required: true, unique: true, index: true },
    paymentInfo: { type: String, default: "" },
    products: { type: Object, required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    pin: { type: String, required: true },
    area: { type: String, default: "" },
    amount: { type: Number, required: true },
    img: { type: String, default: "" },
    status: { type: String, default: "pending", index: true },
    deliveryStatus: { type: String, default: "unshipped" },
}, { timestamps: true });

OrderSchema.index({ email: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
