import orderModel from "../../../db/order.model.js";
import productModel from "../../../db/product.model.js";
import reviewModel from "../../../db/review.model.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";

//&------------------------------------------ Create Review ---------------------------------------------------------

export const createReview = asyncHandler(async(req,res,next)=>{
    const {comment , rate } = req.body ;
    const {productId} = req.params ;
      
    const product = await productModel.findById(productId);
    if(!product){
        return next(new AppError('product is not exist...')) ;
    }

    const reviewExist = await reviewModel.findOne({createdBy : req.user._id ,productId}) ;
    if(reviewExist){
        return next(new AppError('you have already reviewed this item...')) ;
    }
    const order = await orderModel.findOne({
        user : req.user._id ,
        "products.productId" : productId ,
        status : "delivered"
    }) ;
    if(!order){
        return next(new AppError('order is not found...')) ;
    }

    const review = await reviewModel.create({
        comment , 
        rate ,
        productId ,
        createdBy : req.user._id
    }) 

    let sum = product.rateAvg * product.rateNum ;
    sum = sum + rate ;
    product.rateAvg = sum / (product.rateNum + 1 ) ;
    product.rateNum += 1 ;
    await product.save() ;

    res.json({msg : "done" , review}) ;


})

//&------------------------------------------ get Review ---------------------------------------------------------


export const getReview = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params ;
      
    const product = await productModel.findById(productId);
    if(!product){
        return next(new AppError('product is not exist...')) ;
    }
    const reviewExist = await reviewModel.findOne({productId}).find().select('-createdBy') ;
    res.json({msg : "done" , reviewExist}) ;


})
//&------------------------------------------ Delete Review ---------------------------------------------------------

export const deleteReview = asyncHandler(async(req,res,next)=>{
   
    const {id} = req.params ;   
    const review = await reviewModel.findOneAndDelete(
        {
            _id :id ,
            createdBy :req.user._id ,

        }) ;
     
     const product = await productModel.findById(review.productId) ;
     if (product.rateNum > 1) {
        let sum = product.rateAvg * product.rateNum;
        sum = sum - review.rate;
        product.rateAvg = sum / (product.rateNum - 1);
        product.rateNum -= 1;
    } else {
        // If this was the only review, reset the rating
        product.rateAvg = 0;
        product.rateNum = 0;
    }
     await product.save() ;
     res.json({msg : "done"})

})