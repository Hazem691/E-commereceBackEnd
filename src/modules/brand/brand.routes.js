import { Router } from "express";
import { multerHost, validExtension } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth, authorization } from "../../middleware/auth.js";
import { createBrand, deleteBrand, getBrands, updateBrand } from "./brand.controller.js";
import { createBrandValidation, updateBrandValidation } from "./brand.validation.js";



const router = Router() ;
router.get('/getBrands',auth(),authorization(["admin","user"]),getBrands) ;
router.delete('/deleteBrand/:id',auth(),authorization(["admin"]),deleteBrand) ;
router.post('/createBrand',
multerHost(validExtension.image).single('image') , 
validation(createBrandValidation),
auth(),authorization(["admin"]),
createBrand);


router.patch('/updateBrand/:id',
multerHost(validExtension.image).single('image') , 
validation(updateBrandValidation),
auth(),authorization(["admin"]),
updateBrand);

export default router ;