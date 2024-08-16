import { Router } from "express";
import { createSubcategory, deleteSubcategory, getSubcategories, updateSubCategory } from "./subcategory.controller.js";

import { multerHost, validExtension } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { createSubcategoryValidation, updateSubcategoryValidation } from "./subcategory.validation.js";
import { auth, authorization } from "../../middleware/auth.js";
import productRouter from "../product/product.routes.js";





const subcategoryRouter = Router({mergeParams : true});


subcategoryRouter.use('/:subCategoryId/products', productRouter) ;

subcategoryRouter.post('/', multerHost(validExtension.image).single('image'), validation(createSubcategoryValidation), auth(), authorization(['admin']), createSubcategory)

subcategoryRouter.get('/',auth(),authorization(["admin","user"]),getSubcategories) ;
subcategoryRouter.delete('/:id',auth(),authorization(["admin"]),deleteSubcategory) ;
subcategoryRouter.patch('/:id',
    multerHost(validExtension.image).single('image'),
    validation(updateSubcategoryValidation),
    auth(), authorization(["admin"]),
    updateSubCategory);
export default subcategoryRouter;