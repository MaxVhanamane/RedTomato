import connectDb from '../../middleware/mongoose';
import Order from '../../models/orders';
import jwt from "jsonwebtoken"
export default async function handler(req, res) {
    connectDb()
    const userData= jwt.verify(req.body.token,process.env.JWT_TOKEN) 
    // display only those orders where the status is paid.
    let orders= await Order.find({email:userData.email,status:"paid"})
    res.status(200).json({orders })
  }
  