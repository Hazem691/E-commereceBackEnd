import multer from "multer";
import { AppError } from "../utilities/classError.js";





export const validExtension = {
    image : ["image/png" , "image/jpg" , "image/jpeg"] 
}


export const multerHost = (customValidation = ['image/png'])=>{
    const storage = multer.diskStorage({}) ;

   const fileFilter = function(req,file,cb){

        if(customValidation.includes(file.mimetype)){
            return cb(null ,true);
        }else{
            return cb(new AppError('file not supported'),false) ;

        }

    }

    const upload = multer({fileFilter ,storage}) ;
    return upload ;
}