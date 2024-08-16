import { nanoid } from "nanoid";
import categoryModel from "../../../db/category.models.js";
import cloudinary from "../../uploads/cloudinary.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";

import slugify from 'slugify' ;

import { ObjectId } from "bson";
import productModel from "../../../db/product.model.js";
import subCategoryModel from "../../../db/subCategory.models.js";
import brandModel from "../../../db/brand.models.js";



//&==================================== Create product ======================================================


export const createProduct = asyncHandler(async (req,res,next)=>{
    const {stock , discount , price , brand , description , title} = req.body ;

    const {categoryId  ,subCategoryId } = req.params ;
    
    
    const categoryExist = await categoryModel.findOne({_id : categoryId}) ;
    if(!categoryExist){
        return next(new AppError('Category is not Exist ....')) ;
    }

     

    const subCategoryExist = await subCategoryModel.findOne({_id : subCategoryId , category :categoryId}) ;
    if(!subCategoryExist){
        return next(new AppError('subCategory is not Exist ....')) ;
    }



    const brandExist = await brandModel.findOne({_id : brand}) ;
    if(!brandExist){
        return next(new AppError('brand is not Exist ....')) ;
    }



    const productExist = await productModel.findOne({title : title.toLowerCase()}) ;
    if(productExist){
        return next(new AppError('Product already Exist ....')) ;
    }


    
    const subPrice = price - (price * (discount || 0 )/ 100 )


     if(!req.files){
        return next(new AppError('image is required....')) ;
     }
     const customId = nanoid(5) ;
     const list = [] ;
     for(const file of req.files.coverImages){  
        const {secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
            folder : `EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}`
        })
        list.push({secure_url , public_id}) ;
     }
     const {secure_url ,public_id}  = req.files.image[0] ;
     const product = await productModel.create({
        title ,
        slug : slugify(title,{
            lower : true,
            replacement : "_",
        }),
        description ,
        price ,
        discount ,
        subPrice ,
        stock ,
        category : categoryId ,
        subCategory : subCategoryId,
        brand ,
        image : {secure_url , public_id} ,
        coverImages : list ,
        customId ,
        createdBy : req.user._id

     })
    res.json({msg : "done" , product })
    

})

//&==================================== Update product ======================================================

    export const updateProduct = asyncHandler(async (req, res, next) => {
        const { stock, discount, price, brand, description, title} = req.body;
        const { categoryId, subCategoryId , id } = req.params;

        const categoryExist = await categoryModel.findOne({ _id: categoryId });
        if (!categoryExist) {
            return next(new AppError('Category does not exist.'));
        }

        const subCategoryExist = await subCategoryModel.findOne({ _id: subCategoryId, category: categoryId });
        if (!subCategoryExist) {
            return next(new AppError('Subcategory does not exist.'));
        }

        const brandExist = await brandModel.findOne({ _id: brand });
        if (!brandExist) {
            return next(new AppError('Brand does not exist.'));
        }

        const product = await productModel.findOne({ _id: id , createdBy : req.user._id });
        if (!product) {
            return next(new AppError('Product does not exist.'));
        }

        const updatedFields = {};

        if (title) {
            updatedFields.title = title;
            updatedFields.slug = slugify(title, { lower: true, replacement: "_" });
        }
        if (description) updatedFields.description = description;
        if (stock) updatedFields.stock = stock;
        if (price) updatedFields.price = price;
        if (discount) updatedFields.discount = discount;
        if (brand) updatedFields.brand = brand;
    
        if (price && discount !== undefined) {
            updatedFields.subPrice = price - (price * discount / 100);
        }
        if (req.files.image) {
            await cloudinary.uploader.destroy(product.image.public_id);
            const uploadResult = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: `EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}`
            });
            updatedFields.image = { secure_url: uploadResult.secure_url, public_id: uploadResult.public_id };
        }

    
        if (req.files.coverImages) {
            for (const coverImage of product.coverImages) {
                await cloudinary.uploader.destroy(coverImage.public_id);
            }
            const coverImages = [];
            for (const file of req.files.coverImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}`
                });
                coverImages.push({ secure_url, public_id });
            }
            updatedFields.coverImages = coverImages;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(product._id, updatedFields, { new: true });

        res.json({ msg: "done", product: updatedProduct });
    });


//&----------------------------------------- Delete Product---------------------------------------------------

export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { categoryId, subCategoryId, id } = req.params;

    // Check if category and subcategory exist
    const categoryExist = await categoryModel.findById(categoryId);
    if (!categoryExist) {
        return next(new AppError("Category does not exist."));
    }

    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategoryId, category: categoryId });
    if (!subCategoryExist) {
        return next(new AppError("Subcategory does not exist."));
    }


    const product = await productModel.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!product) {
        return next(new AppError("Product does not exist or you don't have permission."));
    }

    if (product.image && product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
    }

    if (product.coverImages) {
        for (const coverImage of product.coverImages) {
            if (coverImage.public_id) {
                await cloudinary.uploader.destroy(coverImage.public_id);
            }
        }
    }


    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}`);
    await cloudinary.api.delete_folder(`EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}`);

    res.json({ msg: "done" });
});

//&==================================== Get All products ======================================================


export const getAllProducts = asyncHandler(async (req,res,next)=>{
     const products = await productModel.find({}) ;
     if(!products){
        next(new AppError("There is no products....")) ;
     }
     res.json({msg : "done" , products})
})


//&==================================== Get Specific product ======================================================


export const getSpecificProduct = asyncHandler(async (req,res,next)=>{
    const {id} = req.params ;
    const product = await productModel.findOne({_id : id}) ;
    if(!product){
       next(new AppError("Product is not found....")) ;
    }
    res.json({msg : "done" , product}) ;
})



