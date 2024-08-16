

import joi from "joi"
import { generalFields } from "../../utilities/generalFields.js"


export const createOrderValidation = {
    body : joi.object({
        productId : joi.string().min(24).max(24),
        quantity : joi.number().integer(),
        phone : joi.string().required(),
        address : joi.string().required(),
        paymentMethod : joi.string().valid('cash','card').required(),
        couponCode : joi.string().min(3)
    }),
    headers : generalFields.headers.required()
}

export const cancelOrderValidation = {
    body : joi.object({
        reason : joi.string().min(3),
    }),
    params : joi.object({
        id : joi.string().min(24).max(24).required() ,
    }) ,
    headers : generalFields.headers.required()
}