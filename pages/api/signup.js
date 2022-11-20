import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import { AES } from 'crypto-js';

export default async function handler(req, res) {
    connectDb()
    const {name,email}=req.body
    if (req.method === "POST") {
        let user = await User.findOne({ "email": req.body.email })
        if(!user){
// Encrypting password
let encyPass = AES.encrypt(req.body.password, process.env.JWT_SECRET).toString();
try{
    let user= new User({name,email,password:encyPass})
    await user.save()
    res.status(200).send({ success: true })
}
catch(err){
    res.status(200).send({ error: err.message })
}
        }

        else{
            res.status(200).send({ success: false, error:"Sorry! The user with this e-mail already exists." })

        }
      
    
    }


    else {
        res.status(400).send({ error: "Not allowed" })
    }
}
