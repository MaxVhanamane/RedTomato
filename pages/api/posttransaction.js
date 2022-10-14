import connectDb from '../../middleware/mongoose';
import Order from '../../models/orders';

let CryptoJS = require("crypto-js");
export default async function handler(req, res) {
    connectDb()
    let order
   
    if (req.method === "POST") {
        // verifying signature  https://razorpay.com/docs/partners/aggregators/partner-auth/payment-gateway/#step-4-verify-payment-signature
// from razor pay docs- order_id: Retrieve the order_id from your server. Do not use the razorpay_order_id returned by Checkout.
  let body=req.body.orderid + "|" + req.body.razorpayPaymentId
  // generating signature
let  generated_signature = CryptoJS.HmacSHA256(body, process.env.RAZORPAY_SECRET).toString(CryptoJS.enc.Hex);
// When signature mateches then we will make the payment status as paid else will send verification failed error.
if (generated_signature == req.body.razorpaySignature) {
    order=await Order.findOneAndUpdate({orderId:req.body.razorpayOrderId},{status:"paid",paymentInfo:JSON.stringify(req.body)})
    res.status(200).json({ success:true,order,message:"Payment Successful."})
}
else{
    res.status(200).json({ success:false,message:"Verification failed" })

}
 
    }
    else {
        res.status(400).send({ error: "Not allowed" })
    }
   
    

}
