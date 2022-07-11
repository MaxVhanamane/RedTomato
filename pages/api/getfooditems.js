import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
export default async function handler(req, res) {
    connectDb()
    let foods = await Food.find()

    res.status(200).json({ foods })
}
