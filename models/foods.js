import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    popularity: { type: String, required: true,default:"low" },
    category: { type: String, required: true },
    size: { type: String,default:"small" },
    price: [{ type: Number, required: true }],
    availableQty: { type: Number, required: true }
}, { timestamps: true });
const Food = mongoose.models.Food || mongoose.model("Food", FoodSchema)

export default Food
