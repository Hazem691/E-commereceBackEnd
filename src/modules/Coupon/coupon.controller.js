import couponModel from "../../../db/coupon.model.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";





//& --------------------------------   Create Coupon  -----------------------------------------------------------



export const createCoupon = asyncHandler(async(req,res,next)=>{
     const {code , amount , fromDate , toDate} = req.body ;


     const couponExist = await couponModel.findOne({code : code.toLowerCase()}) ;
     if(couponExist){
        return next(new AppError('coupon already exist....')) ;
     }

     const coupon = await couponModel.create({
        code , 
        amount ,
        fromDate , 
        toDate ,
        createdBy : req.user._id
     })

     res.json({msg : "done" , coupon}) ;
})



//&------------------------------------------ Update Coupon--------------------------------------------------

export const updateCoupon = asyncHandler(async(req,res,next)=>{
    const {id} = req.params ;
    const {code , amount , fromDate , toDate} = req.body ;
    const coupon = await couponModel.findOneAndUpdate({_id : id , createdBy : req.user._id},{
        code , 
        fromDate ,
        toDate ,
        amount

    },{
        new : true
    }) ;
    if(!coupon){
        return next(new AppError('coupon is not exist....')) ;
    }

    res.json({msg : "done" , coupon}) ;
    
})


//&------------------------------------------ Delete Coupon--------------------------------------------------



export const deleteCoupon = asyncHandler(async(req,res,next)=>{
      const {id} = req.params ; 
      const coupon = await couponModel.findOne({_id : id}) ;
      if(!coupon){
        next(new AppError('coupon is not exits...')) ;
      }

      const deletedCoupon = await couponModel.deleteOne({_id : id}) ;
      res.json({msg : "done" , deletedCoupon}) ;
      
})


//&------------------------------------------ Get All Coupons--------------------------------------------------


export const getCoupons = asyncHandler(async(req,res,next)=>{
     
    const coupon = await couponModel.find({}) ;
    if(!coupon){
      next(new AppError('No coupons exists .....')) ;
    }

    
    res.json({msg : "done" , coupons : coupon}) ;
    
})



//&------------------------------------------ Get Specific Coupon--------------------------------------------------

export const getSpecificCoupon = asyncHandler(async(req,res,next)=>{
     const {id} = req.params ;
    const coupon = await couponModel.findOne({_id : id}) ;
    if(!coupon){
      next(new AppError('Coupon is not exists .....')) ;
    }

    
    res.json({msg : "done" , coupon}) ;
    
})
