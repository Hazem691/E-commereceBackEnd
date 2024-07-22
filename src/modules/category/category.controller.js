import { nanoid } from "nanoid";
import categoryModel from "../../../db/category.models.js";
import cloudinary from "../../uploads/cloudinary.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";

import slugify from 'slugify' ;
import subCategoryModel from "../../../db/subCategory.models.js";
import { ObjectId } from "bson";



//&==================================== Create Category ======================================================


export const createCategory = asyncHandler(async (req,res,next)=>{
    const {name} = req.body ;
    const categoryExist = await categoryModel.findOne({name : name.toLowerCase()}) ;
    if(categoryExist){
        return next(new AppError('Category already Exist ....')) ;
    }
    if(!req.file){
        return next(new AppError('image is required .....')) ;
    }
    const customId = nanoid(5) ;
    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload( req.file.path , {
            folder: `EcommerceC42/Categories/${customId}`
        });
    } catch (err) {
        return next(new AppError('Error uploading to Cloudinary.'));
    }

    const { secure_url, public_id } = uploadResult;

    const category = await categoryModel.create({
        name , 
        slug : slugify(name , {
            replacement : "_",
            lower : true
        }) ,
        image : {secure_url , public_id} ,
        createdBy :req.user._id ,
        customId : customId ,
    }) ;

    res.json({msg : "done" , category}) ;

})




//&==================================== Update Category ======================================================


export const updateCategory = asyncHandler(async(req,res,next)=>{
    const {name} = req.body ;
    const {id} = req.params ;
    const category = await categoryModel.findOne({_id : id , createdBy : req.user._id});
    console.log(category);
    if(!category){
        return next(new AppError("Category is not exist ...",404)) ;
    }
    if(name){
        if(name.toLowerCase()== category.name){
            return next(new AppError("Updated name should be different...."))
        }
        if(await categoryModel.findOne({name : name.toLowerCase()})){
            return next(new AppError("Name is already exist.....")) ;
        }
        category.name = name.toLowerCase() ; 
        category.slug = slugify(name ,{
            replacement : "_",
            lower : true 
        })
    }
    if(req.file){
        await cloudinary.uploader.destroy(category.image.public_id) ;
     let uploadResult;
     try {
        uploadResult = await cloudinary.uploader.upload( req.file.path , {
            folder: `EcommerceC42/Categories/${category.customId}`
        });
    } catch (err) {
        return next(new AppError('Error uploading to Cloudinary.'));
    }

    const { secure_url, public_id } = uploadResult;
    }
    await category.save();
    res.json({msg :"done",category}) ;
})

//&=================================== GET categories =======================================================

export const getCategories = asyncHandler(async (req, res, next) => {

    const categories = await categoryModel.find({});
    let list = [] ;
    for(const category of categories){
        const subCategories = await subCategoryModel.find({category : category._id}) ;
        
        list.push({category , subCategories}) ;
    }
    
    res.json({ msg: "done", categories : list })
})


//&=================================== Delete category =======================================================
export const deleteCategory = asyncHandler(async (req, res, next) => {

    const {id} = req.params ;
    console.log(`Category ID: ${id}`);
    console.log(`owner ID: ${req.user._id}`);
    const category = await categoryModel.findOneAndDelete({_id :id , createdBy : req.user._id }) ;
    console.log(category);
    if(!category){
        return next(new AppError("Category is not exist or you don't have permission"))
    }
    await subCategoryModel.deleteMany({category : category._id}) ;

    //   delete from cloudinary 
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/Categories/${category.customId}`)
    await cloudinary.api.delete_folder(`EcommerceC42/Categories/${category.customId}`) ;
    res.json({msg : "done"}) ;

})