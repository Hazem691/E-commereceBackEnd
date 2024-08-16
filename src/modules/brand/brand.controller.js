
import { nanoid } from "nanoid";
import brandModel from "../../../db/brand.models.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";
import slugify from "slugify";
import cloudinary from "../../uploads/cloudinary.js";

//&==================================== Create Brand ======================================================
export const createBrand = asyncHandler(async (req,res,next)=>{
    const {name} = req.body ;
    const brandExist = await brandModel.findOne({name : name.toLowerCase()}) ;
    if(brandExist){
        return next(new AppError('Brand already Exist ....')) ;
    }
    if(!req.file){
        return next(new AppError('image is required .....')) ;
    }
    const customId = nanoid(5) ;
    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(req.file.path , {
            folder: `EcommerceC42/Brands/${customId}`
        });
    } catch (err) {
        return next(new AppError('Error uploading to Cloudinary.'));
    }

    const { secure_url, public_id } = uploadResult;

    const brand = await brandModel.create({
        name , 
        slug : slugify(name , {
            replacement : "_",
            lower : true
        }) ,
        image : {secure_url , public_id} ,
        createdBy :req.user._id ,
        customId : customId ,
    }) ;

    res.json({msg : "done" , brand}) ;

})



//&==================================== Update Brand ======================================================


export const updateBrand = asyncHandler(async(req,res,next)=>{
    const {name} = req.body ;
    const {id} = req.params ;
    const brand = await brandModel.findOne({_id : id , createdBy : req.user._id});
    
    if(!brand){
        return next(new AppError("brand is not exist ...",404)) ;
    }
    if(name){
        if(name.toLowerCase()== brand.name){
            return next(new AppError("Updated name should be different...."))
        }
        if(await brandModel.findOne({name : name.toLowerCase()})){
            return next(new AppError("Name is already exist.....")) ;
        }
        brand.name = name.toLowerCase() ; 
        brand.slug = slugify(name ,{
            replacement : "_",
            lower : true 
        })
    }
    if(req.file){
        await cloudinary.uploader.destroy(brand.image.public_id) ;
     let uploadResult;
     try {
        uploadResult = await cloudinary.uploader.upload( req.file.path , {
            folder: `EcommerceC42/Brands/${brand.customId}`
        });
    } catch (err) {
        return next(new AppError('Error uploading to Cloudinary.'));
    }

    const { secure_url, public_id } = uploadResult;
    }
    await brand.save();
    res.json({msg :"done",brand}) ;
})


//& ======================================  Get brands =======================================================


export const getBrands = asyncHandler(async (req, res, next) => {

    const brands = await brandModel.find({}) ;
    res.json({ msg: "done", brands })
})

//&=================================== Delete brand =======================================================
export const deleteBrand = asyncHandler(async (req, res, next) => {

    const {id} = req.params ;
    
    const brand = await brandModel.findOneAndDelete({_id :id , createdBy : req.user._id }) ;
   
    if(!brand){
        return next(new AppError("Brand is not exist or you don't have permission"))
    }
   
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/Brands/${brand.customId}`)
    await cloudinary.api.delete_folder(`EcommerceC42/Brands/${brand.customId}`) ;
    res.json({msg : "done"}) ;

})