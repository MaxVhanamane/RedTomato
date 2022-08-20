import connectDb from '../../middleware/mongoose';
const Razorpay = require('razorpay');
import Order from '../../models/orders';
import Food from './../../models/foods';
export default async function handler(req, res) {
  connectDb()


  if (req.method === "POST") {

    // Check if the cart is tempered with
    let cart = req.body.cart
    let foodItem
    for (let item in cart) {
      // console.log("item", cart[item].slug)
       foodItem = await Food.findOne({ slug: cart[item].slug })
      if (cart[item].size === "small") {
        // console.log(foodItem.price[0], cart[item].price)
        if (foodItem.price[0] != cart[item].price) {
          res.status(200).json({ success: false, error: "The price of some food items has changed in your cart. Please try again." })
          return
        }
      }
      if (cart[item].size === "medium") {
        if (foodItem.price[1] != cart[item].price) {
          res.status(200).json({ success: false, error: "The price of some food items has changed in your cart. Please try again." })
          return
        }
      }
      if (cart[item].size === "large") {
        
        if (foodItem.price[2] != cart[item].price) {
          
          res.status(200).json({ success: false, error: "The price of some food items has changed in your cart. Please try again." })
          return
        }
      }
    }

    // check if the details are valid
    if(req.body.phone.length !=10 || isNaN(req.body.phone)){
      res.status(200).json({success:false,error:"Please enter your 10 digit phone number."})
      return
    }
    if(isNaN(req.body.pin)){
      
      res.status(200).json({success:false,error:"Please enter valid 6 digit pincode."})
      return
    }

    
    // Razor pay code
    try {

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      const options = {
        amount: req.body.total,
        currency: 'INR',
        receipt: Math.floor(Math.random() * Date.now()).toString(),
      };

      const order = await instance.orders.create(options);

      // adding order in db
      if (order) {
        let orderItem = new Order({
          email: req.body.email,
          paymentInfo: " ",
          orderId: order.id,
          address: req.body.address,
          amount: (req.body.total) / 100, //To store money in rupees in our db we will divide it by 100 as razor pay gives money in paise
          products: req.body.cart,
          img:foodItem.img,
        })

        await orderItem.save()
        
        res.status(200).json({success:true,order});

      }

      else if (!order) return res.status(500).json({ error: 'Some error occured' });

      // res.send(order);

    } catch (error) {
      res.status(500).json({ "error": error.message });
    }

  }


  
}
