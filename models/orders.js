const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentInfo: { type: String, required: true },
    products: {type: Object, required: true},
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    pin: { type: String, required: true },
    area: { type: String, default:"" },
    amount: { type: Number, required: true },
    img: { type: String, required: true },
    status: { type: String,  default: "pending" },
    deliveryStatus: { type: String,  default: "unshipped" },
}, { timestamps: true });
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema)
export default Order
