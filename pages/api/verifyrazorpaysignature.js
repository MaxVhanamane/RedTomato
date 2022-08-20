
 let { validatePaymentVerification } = require('./dist/utils/razorpay-utils');
 import sha256 from 'crypto-js/sha256';

export default function handler(req, res) {
    // generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, process.env.RAZORPAY_SECRET);
    let body=req.body.orderid + "|" + req.body.razorpayPaymentId
    console.log(body)
  let  generated_signature = sha256(body, process.env.RAZORPAY_SECRET);
  if (generated_signature == req.body.razorpaySignature) {
    console.log("payment is successful")
  }

  let status=  validatePaymentVerification({"order_id": req.body.orderid, "payment_id": req.body.razorpayPaymentId }, req.body.razorpaySignature, process.env.RAZORPAY_SECRET);
    res.status(200).json({ name: 'John Doe' })
  }
  


