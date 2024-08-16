import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./category.controller.js";
import { multerHost, validExtension } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { createCategoryValidation, updateCategoryValidation } from "./category.validation.js";
import { auth, authorization } from "../../middleware/auth.js";
import subcategoryRouter from "../subcategory/subcategory.routes.js";




const router = Router() ;



router.use('/:categoryId/subcategories',subcategoryRouter);



router.get('/',auth(),authorization(["admin","user"]),getCategories);


router.delete('/:id',auth(),authorization(["admin"]),deleteCategory) ;
router.post('/',
multerHost(validExtension.image).single('image') , 
validation(createCategoryValidation),
auth(),authorization(["admin"]),
createCategory);

router.patch('/:id',
multerHost(validExtension.image).single('image') , 
validation(updateCategoryValidation),
auth(),authorization(["admin"]),
updateCategory);

export default router ;