import connectDb from '../../middleware/mongoose';
const Razorpay = require('razorpay');

export default async function handler(req, res) {
    connectDb()
    console.log("ye wala ",req.body.total)
    if (req.method === "POST") {
       console.log(process.env.RAZORPAY_KEY_ID,process.env.RAZORPAY_SECRET)
       try {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_SECRET,
        });
        const options = {
          amount: req.body.total,
          currency: 'INR',
        };
        const order = await instance.orders.create(options);
        console.log(order)
        if (!order) return res.status(500).json({error:'Some error occured'});
        res.send(order);
      } catch (error) {
        res.status(500).json({"error":error});
      }
    
    }


    else {
        res.status(400).send({ error: "Not allowed" })
    }
}
