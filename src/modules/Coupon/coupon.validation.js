
import joi from 'joi'
import { generalFields } from '../../utilities/generalFields.js'

export const createCouponValidation = {
    body : joi.object({
        code : joi.string().min(3).max(30).required(),
        amount : joi.number().min(1).max(100).integer().required(),
        fromDate : joi.date().greater(Date.now()).required(),
        toDate : joi.date().greater(joi.ref("fromDate")).required() , 
    }),
    headers : generalFields.headers.required(),
}


export const updateCouponValidation = {
    body : joi.object({
        code : joi.string().min(3).max(30),
        amount : joi.number().min(1).max(100).integer(),
        fromDate : joi.date().greater(Date.now()),
        toDate : joi.date().greater(joi.ref("fromDate")) , 
    }),
    headers : generalFields.headers.required(),
}

export const deleteCouponValidation = {
    headers : generalFields.headers.required()
}

export const getAllCouponsValidation = {
    headers : generalFields.headers.required()
}


export const getSpecificCouponValidation = {
    headers : generalFields.headers.required()
}