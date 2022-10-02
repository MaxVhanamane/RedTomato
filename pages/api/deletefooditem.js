import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
export default async function handler(req, res) {
    console.log(req.body)
    connectDb()
    if (req.method === "POST") {
       
            let deleteFoodItem = await Food.findByIdAndDelete(req.body)
            res.status(200).send({ success: "updated successfully" })
        
    }
    else {
        res.status(400).send({ error: "Not allowed" })
    }

}
