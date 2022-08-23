import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import jwt from "jsonwebtoken"
export default async function handler(req, res) {
    connectDb()
    if (req.method === "PUT") {
        try{
        let token = req.body.tokenVal
       let user= jwt.verify(token, process.env.JWT_SECRET);
       console.log("user",user)
       let dbUser=await User.findOneAndUpdate({email:user.email},{name:req.body.name,address:req.body.address,phone:req.body.phone,state:req.body.state,area:req.body.area,city:req.body.city,pin:req.body.pin})
       res.status(200).json({success:true})
    }
    catch(error){
      
        res.status(500).json({message:"Internal server error. Please try again later!"})
    }
}
else{
    res.status(405).send({message:"Not Allowed"})
}

}
