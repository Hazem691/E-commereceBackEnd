import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { createWishlistValidation, deleteFromWishListValidation, getFromWishListValidation } from "./wishlist.validation.js";
import { auth } from "../../middleware/auth.js";
import { createWishList, deleteFromWishList, getFromWishList } from "./wishlist.controller.js";






const wishlistRouter = Router({mergeParams : true}) ;

wishlistRouter.post('/',validation(createWishlistValidation) ,auth() , createWishList) ;


wishlistRouter.get('/',validation(getFromWishListValidation) ,auth() , getFromWishList) ;

wishlistRouter.delete('/',validation(deleteFromWishListValidation) ,auth() , deleteFromWishList) ;

export default wishlistRouter ;