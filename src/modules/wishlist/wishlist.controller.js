import productModel from "../../../db/product.model.js";
import wishlistModel from "../../../db/wishlist.model.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";


//&------------------------------------ Create WishList ----------------------------------------------------

export const createWishList = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params ;
    const product = await productModel.findById({_id : productId}) ;
    if(!product){
         return next(new AppError('product is not exist ...')) ;
    }
    const wishlist = await wishlistModel.findOne({user : req.user._id}) ;
    if(!wishlist){
        const newWishlist = await wishlistModel.create({
            user : req.user._id ,
            products : [productId]
        })
        res.json({msg : "done" , newWishlist}) ;
    }
    else{
        const newWishlist = await wishlistModel.updateOne({user : req.user._id} , {
            $addToSet : {products : productId} ,
        }) ;
        res.json({msg : "done" , newWishlist})
    }

})

//&------------------------------------ Get from WishList ----------------------------------------------------

export const getFromWishList = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params ;
    const product = await productModel.findById({_id : productId}) ;
    if(!product){
         return next(new AppError('product is not exist ...')) ;
    }
    const wishlist = await wishlistModel.findOne({user : req.user._id}) ;
    if(!wishlist){
        return next(new AppError('wishlist is not exist...')) ;
        }
        res.json({msg : "done" , wishlist}) ;
    }
   

)


//&------------------------------------ Delete from WishList ----------------------------------------------------



export const deleteFromWishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await productModel.findById({ _id: productId });
    
    if (!product) {
        return next(new AppError('Product does not exist...'));
    }

    const wishlist = await wishlistModel.findOne({ user: req.user._id });

    if (!wishlist) {
        return next(new AppError('Wishlist not found...'));
    }

    // Remove the product from the wishlist using the $pull operator
    const updatedWishlist = await wishlistModel.updateOne(
        { user: req.user._id },
        { $pull: { products: productId } }
    );

    res.json({ msg: "Product removed from wishlist", updatedWishlist });
});