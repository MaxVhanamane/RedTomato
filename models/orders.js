const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String },
        quntity: { type: Number, default: 1 }
    }],
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" }
}, { timestamps: true });
const Order =mongoose.models.Order || mongoose.model("Order", OrderSchema)
export default Order
 