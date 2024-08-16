import { Router } from "express";
import { multerHost, validExtension } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { createProductValidation, deleteProductValidation, getAllProductsValidation, getSpecificProductValidation, updateProductValidation } from "./product.validation.js";
import { auth, authorization } from "../../middleware/auth.js";
import { createProduct, deleteProduct, getAllProducts, getSpecificProduct, updateProduct } from "./product.controller.js";
import reviewRouter from "../review/review.routes.js";
import { wishlistRouter } from "../index.routes.js";





const productRouter = Router({mergeParams : true}) ;

productRouter.use('/:productId/reviews',reviewRouter) ;

productRouter.use('/:productId/wishlist' ,wishlistRouter) ;

productRouter.post('/', 
multerHost(validExtension.image).fields([{name : "image" , maxCount : 1},{name : "coverImages" , maxCount :3}]) ,
validation(createProductValidation),
auth(),
authorization(["admin"]),
createProduct


)

productRouter.delete('/:id',validation(deleteProductValidation),auth(),authorization(["admin"]),deleteProduct) ;


productRouter.get('/',validation(getAllProductsValidation),auth(),getAllProducts) ;

productRouter.get('/:id',validation(getSpecificProductValidation),auth(),getSpecificProduct) ;


productRouter.patch('/:id',multerHost(validExtension.image).fields([{name : "image" , maxCount : 1},{name : "coverImages" , maxCount :3}]) ,validation(updateProductValidation),auth(),authorization(['admin']),updateProduct) ;
export default productRouter ;