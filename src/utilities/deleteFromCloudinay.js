import cloudinary from "../uploads/cloudinary.js"


export const deleteFromCloudinay =async (req,res,next)=>{
     if(req?.filePath){
         await cloudinary.api.delete_resources_by_prefix(req.filePath) ;
         await cloudinary.api.delete_folder(req.filePath) ;
         
     }
}