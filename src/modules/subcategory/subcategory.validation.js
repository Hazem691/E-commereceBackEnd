import joi from "joi";
import { generalFields } from "../../utilities/generalFields.js";



export const createSubcategoryValidation = {
    body : joi.object({
        name : joi.string().min(3).max(30).required(),
      
    }).required(),

    file : generalFields.file.required() ,
    headers : generalFields.headers.required() ,
}

export const updateSubcategoryValidation = {
    body : joi.object({
        name : joi.string().min(3).max(30),
       
    }).required(),
    file : generalFields.file,
    headers : generalFields.headers.required() ,
}