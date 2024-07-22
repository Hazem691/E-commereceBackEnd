import { Router } from "express";
import { forgetPassword, refreshToken, resetPassword, signIn, signUp, verifyEmail } from "./user.controller.js";




const router = Router() ;

router.post('/signUp',signUp) ;
router.get('/verifyEmail/:token',verifyEmail);
router.get('/refreshToken/:refToken',refreshToken) ;
router.patch('/forgerPassword',forgetPassword) ;
router.patch('/resetPassword',resetPassword) ;
router.post('/signIn',signIn) ;
export default router ;