
import joi from "joi"
import { generalFields } from "../../utilities/generalFields.js"

export const createCartValidation = {
    body : joi.object({
        productId : joi.string().min(24).max(24).required(),
        quantity : joi.number().integer().required(),
    }),
    headers : generalFields.headers.required() ,
      

}


export const removeProductFormCartValidation = {
    body : joi.object({
        productId : joi.string().min(24).max(24).required(),
    }),
    headers : generalFields.headers.required() ,
}

export const getCartValidation = {
    headers : generalFields.headers.required() ,
}


export const clearCartValidation = { 
    headers : generalFields.headers.required() ,
}