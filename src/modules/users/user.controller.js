import userModel from "../../../db/user.models.js";
import { sendEmail } from "../../services/sendEmail.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { customAlphabet, nanoid } from "nanoid";


//& ===================================================   SignUp ======================================================



export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, age, phone, address ,role ,passwordChangedAt } = req.body;
    const userExist = await userModel.findOne({ email: email.toLowerCase() });
    if (userExist) {
        return next(new AppError("User is already exist ..."));
    }
    const token = jwt.sign({ email }, "generateTokenSecret", { expiresIn: 60 * 2 });
    const link = `${req.protocol}://${req.headers.host}/verifyEmail/${token}`;

    const refToken = jwt.sign({ email }, "generateTokenSecretRef");
    const refLink = `${req.protocol}://${req.headers.host}/refreshToken/${refToken}`;
    await sendEmail(email, "verify Email", `<h2>Click here : ${link}</h2>   <h2>refresh the OTP : ${refLink} </h2>`);
    const hash = bcrypt.hashSync(password, 10);
    const user = new userModel({
        name,
         email,
          password : hash,
           age,
            phone,
             address,
             role,
             passwordChangedAt: new Date()
    })
    const newUser = await user.save();

    newUser ? res.json({msg : "done"}) : next(new AppError("User is not created...")) ;
})



//& ===================================================   Verify Email =================================================

export const verifyEmail = asyncHandler(async(req,res,next)=>{
    const {token} = req.params ;
    const decoded = jwt.verify(token ,"generateTokenSecret") ;
    if(!decoded?.email){
        return next(new AppError('invalid token')) ;
    }
    const user = await userModel.findOneAndUpdate({email : decoded.email , confirmed : false} , {confirmed : true},{new : true}) ;
    user ? res.json({msg : "done"}) : next(new AppError("user is not exist or already confirmed...")) ;
})

//& =================================================== Refresh Token  =================================================

export const refreshToken = asyncHandler(async(req,res,next)=>{
    const {refToken} = req.params ;
    const decoded = jwt.verify(refToken,"generateTokenSecretRef") ;
    if(!decoded?.email){
        return next(new AppError('invalid token')) ;
    }
    const user = await userModel.findOne({email : decoded.email , confirmed : true}) ;
    if(user){
        return next(new AppError("user already confirmed or not exist ...."))
    }
    const token = jwt.sign( {email :decoded.email} , "generateTokenSecret", { expiresIn: 60 * 2 });
    const link = `${req.protocol}://${req.headers.host}/verifyEmail/${token}`;
    await sendEmail(decoded.email, "verify Email", `<h2>Click here : ${link}</h2>`);
     res.json({msg : "done"}) ;
})


//& =================================================== Forget Password  =================================================

export const forgetPassword = asyncHandler(async(req,res,next)=>{
    const {email} = req.body ;
    const user = await userModel.findOne({email : email.toLowerCase()}) ;
    if(!user){
        return next(new AppError('user is not found.....')) ;
    }
    const code = customAlphabet("0123456789",5) ;
    const newCode = code() ;
    await sendEmail(email , "Code for reseting your password" , `<h1>Your Code is : ${newCode}</h1>`) ;
    await userModel.updateOne({email},{code : newCode}) ;
    res.status(200).json({msg : "done"}) ;
})


//& =================================================== Reset Password  =================================================


export const resetPassword = asyncHandler(async (req,res,next)=>{
     const {email , code , password} = req.body ;
     const user = await userModel.findOne({email : email.toLowerCase()}) ;
     if(!user){
         return next(new AppError("user is not found ...")) ;
     }
     if(user.code !== code){
        return next(new AppError("code is invalid.....")) ;
     }
     const hash = bcrypt.hashSync(password,Number(process.env.saltRounds)) ;
     await userModel.updateOne({email},{password : hash , code :"" , passwordChangedAt : Date.now()}) ;
     res.json({msg : "done"}) ;
})


//& =================================================== SignIn  =================================================


export const signIn = asyncHandler(async(req,res,next)=>{
     const {email , password} = req.body ;
     const user = await userModel.findOne({email : email, confirmed:true}) ;
     console.log("we found the user is : ",user);
     if(!user || !bcrypt.compareSync(password, user.password)){
         return next(new AppError("User is not found or wrong password .....")) ;
     }
     const token = jwt.sign({email , role : user.role} , process.env.signatureKey) ;
     await userModel.updateOne({email},{loggedIn : true}) ;
     res.json({msg : "done" , token}) ;
})
