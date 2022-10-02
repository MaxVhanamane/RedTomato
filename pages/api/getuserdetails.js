import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import jwt from "jsonwebtoken"
export default async function handler(req, res) {
    connectDb()
    if (req.method === "POST") {
        try{
        let token = req.body.tokenVal
       let user= jwt.verify(token, process.env.JWT_SECRET);
       let dbUser=await User.findOne({email:user.email})
       const {name,email,address,city,state,phone,pin,area,role}=dbUser
       res.status(200).json({success:true,name,email,address,city,state,phone,pin,area,role})
    }
    catch(error){
        res.status(200).json({success:false,error:error.message})
    }
}}
