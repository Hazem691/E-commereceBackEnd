import joi from "joi";
import { generalFields } from "../../utilities/generalFields.js";



export const createBrandValidation = {
    body : joi.object({
        name : joi.string().min(3).max(30).required()
    }).required(),

    file : generalFields.file.required() ,
    headers : generalFields.headers.required() ,
}

export const updateBrandValidation = {
    body : joi.object({
        name : joi.string().min(3).max(30)
    }).required(),

    file : generalFields.file,
    headers : generalFields.headers.required() ,
}