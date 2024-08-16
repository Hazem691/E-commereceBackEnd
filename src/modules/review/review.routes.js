import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { createReview, deleteReview, getReview } from "./review.controller.js";
import { validation } from "../../middleware/validation.js";
import { createReviewValidation, deleteReviewValidation, getReviewValidation } from "./review.validation.js";



const reviewRouter = Router({mergeParams :true}) ;

reviewRouter.post('/',validation(createReviewValidation),auth(),createReview) ;

reviewRouter.get('/',validation(getReviewValidation),getReview) ;

reviewRouter.delete('/:id',validation(deleteReviewValidation),auth(),deleteReview) ;
export default reviewRouter ;