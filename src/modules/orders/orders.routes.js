import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { cancelOrderValidation, createOrderValidation } from "./orders.validation.js";
import { auth } from "../../middleware/auth.js";
import { cancelOrder, createOrder, getOrder } from "./orders.controller.js";




const orderRouter = Router() ;


orderRouter.post('/',validation(createOrderValidation),auth(),createOrder) ;

orderRouter.delete('/:id',validation(cancelOrderValidation),auth(),cancelOrder) ;

orderRouter.get('/',auth(),getOrder) ;
export default orderRouter ;