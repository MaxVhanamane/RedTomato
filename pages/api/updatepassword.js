import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import jwt from "jsonwebtoken";
import { AES, enc } from 'crypto-js';

export default async function handler(req, res) {
    connectDb()
    if (req.method === "PUT") {
        try {
            let token = req.body.tokenVal
            let user = jwt.verify(token, process.env.JWT_SECRET);
            let dbUser= await User.findOne({email:user.email})
            if (dbUser) {
                // Decrypting password to verify user

                let bytes = AES.decrypt(dbUser.password, process.env.JWT_SECRET);
                let decryptedPass = bytes.toString(enc.Utf8);
               
                if(decryptedPass===req.body.password){
                    let updatePass = await User.findOneAndUpdate({ email: user.email }, {password:AES.encrypt(req.body.newPassword, process.env.JWT_SECRET).toString()})
                    res.status(200).json({ success: true })
                }

            else{
                res.status(200).json({message:"Your old password is wrong"})
            }

            }

        }
        catch (error) {

            res.status(500).json({ message: "Internal server error. Please try again later!" })
        }
    }
    else{
        res.status(405).send({message:"Not Allowed"})
    }
}
