import joi from "joi";
import { generalFields } from "../../utilities/generalFields.js";

export const createReviewValidation = {
    body : joi.object({
        comment : joi.string().required(),
        rate : joi.number().min(1).max(5).integer().required(),
    }),
    params : joi.object({
        productId : joi.string().min(24).max(24).required()
    }).required(),
    headers : generalFields.headers.required()
}


export const deleteReviewValidation = {
    params : joi.object({
        id : joi.string().min(24).max(24).required()
    }).required(),
    headers : generalFields.headers.required()
}


export const getReviewValidation = {
    params : joi.object({
        productId : joi.string().min(24).max(24).required()
    }).required(),
   
}