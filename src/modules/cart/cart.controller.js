import cartModel from "../../../db/cart.model.js";
import productModel from "../../../db/product.model.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";



//&---------------------------------------- Create And Update Cart ----------------------------------------------


export const createCart = asyncHandler(async (req,res,next)=>{
    const {productId , quantity} = req.body ;
    const product = await productModel.findOne({_id :productId , stock : {$gte: quantity}}) ;
    if(!product){
        return next(new AppError('product is not exist....')) ;
    }
    const cartExist = await cartModel.findOne({user : req.user._id}) ;
    if(!cartExist){
        const cart = await cartModel.create({
            user : req.user._id ,
            products : [{
                productId ,
                quantity
            }
            ]
        }) ;

        return res.json({msg : "done" ,cart}) ;
    }

    let flag = false ;
    for(const product of cartExist.products){ 
         if(productId == product.productId){
            product.quantity = quantity ;
            flag = true ;
         }
    }
    if(!flag){
        cartExist.products.push({
            productId ,
            quantity 
        })
    }

    await cartExist.save() ;
    res.json({msg : "done" ,cart : cartExist}) ;
})



//&---------------------------------------- Remove Product from Cart ----------------------------------------------

export const removeProductFormCart = asyncHandler(async(req,res,next)=>{
    const {productId} = req.body ;


    const cartExist = await cartModel.findOneAndUpdate({
        user : req.user._id ,
        "products.productId" : productId
    },{
        $pull : {products : {productId}}
    },{
        new : true
    })


    res.json({msg : "done" , cart : cartExist}) ;
})



//&---------------------------------------- Clear Cart ----------------------------------------------


export const clearCart = asyncHandler(async(req,res,next)=>{
  
    const cartExist = await cartModel.findOneAndUpdate(
     {user :req.user._id },
    {
        products : [] ,
    },{
        new : true ,
    }) ;
  
    res.json({msg : "done" , cart : cartExist}) ;
})


//&---------------------------------------- Get logged Cart ----------------------------------------------



export const getCart = asyncHandler(async(req,res,next)=>{
    const cartExist = await cartModel.findOne({user :req.user._id }) ;
    if(!cartExist){
        return next(new AppError('cart is not exist...')) ;
    }
    res.json({msg : "done" , cart : cartExist}) ;
})