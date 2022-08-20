import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import { AES } from 'crypto-js';

export default async function handler(req, res) {
    connectDb()
    const {name,email}=req.body
    if (req.method === "POST") {
       
      // Encrypting password
        var encyPass = AES.encrypt(req.body.password, process.env.JWT_TOKEN).toString();
        try{
            let user= new User({name,email,password:encyPass})
            await user.save()
            res.status(200).send({ success: "success" })
        }
        catch(err){
            res.status(200).send({ error: err.message })
        }
    
    }


    else {
        res.status(400).send({ error: "Not allowed" })
    }
}
