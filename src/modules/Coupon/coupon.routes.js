import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { createCouponValidation, deleteCouponValidation, getAllCouponsValidation, getSpecificCouponValidation, updateCouponValidation } from "./coupon.validation.js";
import { auth, authorization } from "../../middleware/auth.js";
import { createCoupon, deleteCoupon, getCoupons, getSpecificCoupon, updateCoupon } from "./coupon.controller.js";





const couponRouter = Router() ;

couponRouter.post('/',validation(createCouponValidation) ,auth(),authorization(["admin"]) , createCoupon) ;

couponRouter.patch('/:id',validation(updateCouponValidation) , auth(),authorization(["admin"]) , updateCoupon) ;

couponRouter.delete('/:id',validation(deleteCouponValidation),auth(),authorization(["admin"]),deleteCoupon) ;

couponRouter.get('/',validation(getAllCouponsValidation),auth(),getCoupons) ;

couponRouter.get('/:id',validation(getSpecificCouponValidation),auth(),getSpecificCoupon) ;



export default couponRouter ;