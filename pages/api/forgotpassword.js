import connectDb from '../../middleware/mongoose';
import cryptoRandomString from 'crypto-random-string';
import ForgotPasswordToken from './../../models/forgotpasswordtoken';
const nodemailer = require("nodemailer");
import { AES, enc } from 'crypto-js';
import User from '../../models/users';

export default async function handler(req, res) {
    connectDb()
    // check if the user exists in the database
    let verifyUser=await User.findOne({email:req.body.email})
   if(verifyUser){

    // generate random token to verify user later 
    let randomToken = cryptoRandomString({ length: 20, type: 'alphanumeric' });
    //  when user clicks on Request reset link we will receive sendMail as true. 
    if (req.body.sendMail) {
        // check if the user already exits in the forgot password db.
        let user = await ForgotPasswordToken.findOne({ email: req.body.email })
        // if the user exits then we will update the token for that user else we will create that user in forgot password db.
        if (user) {
            await ForgotPasswordToken.findOneAndUpdate({ email: req.body.email }, { token: randomToken, expiresIn: new Date().getTime() + 200 * 1000 })
        }
        else {
            let forgetToken = new ForgotPasswordToken({
                email: req.body.email,
                token: randomToken,
                expiresIn: new Date().getTime() + 200 * 1000
            })
            await forgetToken.save()

        }

 // Creating a mail template
        let email = `

    We have sent you this email in response to your request to reset your password on redtomato.com. 
    To reset your password, please follow the link below:

    <a href=${process.env.NEXT_PUBLIC_HOST}/forgotpassword?token=${randomToken}&email=${req.body.email}>Click here to reset your password</a>

    <br/><br/>

    We recommend that you keep your password secure and not share it with anyone.If you feel your password has been compromised, you can change it by going to your My Account Page.

    <br/><br/>
    The above link will expire in two minutes.
    `
    // Sending a mail using nodemailer (read docs)
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_ADDRESS, 
                pass: process.env.EMAIL_PASSWORD, 
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "oreo.max.1998@gmail.com", // sender address
            to: req.body.email, // list of receivers
            subject: "Password reset for your account on redtomato.com", // Subject line
            html: email, // html body
        });
        res.status(200).json({ success: true })

    }

    else{
        let dbUser= await ForgotPasswordToken.findOne({ email: req.body.email })
        if(dbUser.token===req.body.token){

        
            let difference=  dbUser.expiresIn-new Date().getTime()
 
            if(dbUser.token===req.body.token &&(difference>0)){
              
                try{
                   await User.findOneAndUpdate({ email: req.body.email }, {password:AES.encrypt(req.body.newPassword, process.env.JWT_SECRET).toString()})
                    res.status(200).json({ success: true,message:"Password changed Successfully" })

                }
                catch(error){
                res.status(200).json({success: false,message:"Internal Server Error. Please try again later."})
                  
                }
               

            }

            else{
                
                res.status(200).json({success:false,message:"Sorry! Your token has expired. Please request a new password rest link."})
            }
        }

        else{
            res.status(200).json({success:false,message:"Invalid token"})
        }


    }
}
else{
    res.status(200).json({ success: false })
}

}
