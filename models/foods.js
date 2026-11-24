import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    desc: { type: String, required: true, trim: true },
    img: { type: String, required: true },
    popularity: { type: String, required: true, default: "low", index: true },
    category: { type: String, required: true, index: true },
    size: { type: String, default: "small" },
    price: [{ type: Number, required: true }],
    availableQty: { type: Number, required: true, min: 0 }
}, { timestamps: true });

FoodSchema.index({ category: 1, popularity: 1 });

const Food = mongoose.models.Food || mongoose.model("Food", FoodSchema);

export default Food;
