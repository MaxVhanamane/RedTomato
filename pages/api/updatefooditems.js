import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
export default async function handler(req, res) {
    console.log(req.body)
    connectDb()
    if (req.method === "POST") {
        for (let i = 0; i < req.body.length; i++) {
            let updateFooditems = await Food.findByIdAndUpdate(req.body[i]._id, req.body[i])
            res.status(200).send({ success: "updated successfully" })
        }
    }
    else {
        res.status(400).send({ error: "Not allowed" })
    }

}
