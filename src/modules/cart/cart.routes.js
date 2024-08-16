import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { clearCartValidation, createCartValidation, getCartValidation, removeProductFormCartValidation } from "./cart.validation.js";
import { auth, authorization } from "../../middleware/auth.js";
import { clearCart, createCart, getCart, removeProductFormCart } from "./cart.controller.js";



const cartRouter = Router() ;



cartRouter.post('/',validation(createCartValidation),auth(),createCart) ;

cartRouter.delete('/deleteproductfromCart',validation(removeProductFormCartValidation),auth(),removeProductFormCart) ;
cartRouter.delete('/clearCart',validation(clearCartValidation),auth(),clearCart) ;

cartRouter.get('/',validation(getCartValidation),auth(),getCart) ;
export default cartRouter ;