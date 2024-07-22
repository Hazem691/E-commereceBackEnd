import { nanoid } from "nanoid";
import subCategoryModel from "../../../db/subCategory.models.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";
import categoryModel from "../../../db/category.models.js";
import cloudinary from "../../uploads/cloudinary.js";
import slugify from "slugify";


//& ======================================  CreateSubcategories ==============================================

export const createSubcategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const categoryExist = await categoryModel.findById(req.params.categoryId);
    console.log(categoryExist);
    if (!categoryExist) {
        return next(new AppError('Category is not Exist ....'));
    }
    const subCategoryExist = await subCategoryModel.findOne({ name: name.toLowerCase() });
    if (subCategoryExist) {
        return next(new AppError('Subcategory already Exist ....'));
    }
    if (!req.file) {
        return next(new AppError('image is required .....'));
    }
    const customId = nanoid(5);
    let uploadResult;
    try {

        uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: `EcommerceC42/Categories/${categoryExist.customId}/subCategories/${customId}`
        });
    } catch (err) {
        return next(new AppError('Error uploading to Cloudinary.'));
    }

    const { secure_url, public_id } = uploadResult;
    console.log(req.user._id);
    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name, {
            replacement: "_",
            lower: true
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        category: req.params.categoryId,
        customId,
    });

    res.json({ msg: "done", subCategory });
})


//&==================================== Update SubCategory ======================================================

export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const subCategory = await subCategoryModel.findOne({ _id: id, createdBy: req.user._id });
    const categoryExist = await categoryModel.findById(req.params.categoryId);

    if (!categoryExist) {
        return next(new AppError('Category does not exist.'));
    }
    if (!subCategory) {
        return next(new AppError("SubCategory does not exist.", 404));
    }
    if (name) {
        if (name.toLowerCase() === subCategory.name) {
            return next(new AppError("Updated name should be different."));
        }
        if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("Name already exists."));
        }
        subCategory.name = name.toLowerCase();
        subCategory.slug = slugify(name, {
            replacement: "_",
            lower: true
        });
    }
    if (req.file) {
        await cloudinary.uploader.destroy(subCategory.image.public_id);
        let uploadResult;
        try {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: `EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subCategory.customId}`
            });
        } catch (err) {
            return next(new AppError('Error uploading to Cloudinary.'));
        }

        const { secure_url, public_id } = uploadResult;
        subCategory.image = { secure_url, public_id };
    }
    await subCategory.save();
    res.json({ msg: "done", subCategory });
});


//&==================================== Get SubCategory ======================================================


export const getSubcategories = asyncHandler(async (req, res, next) => {

    const subcategories = await subCategoryModel.find({}).populate(
        [{
            path: "category",
            select : "name -_id"

        }, {
            path: "createdBy",
            select : "name -_id"
        }]

    );
    res.json({ msg: "done", subcategories })
})


//&=================================== Delete subCategory =======================================================
export const deleteSubcategory = asyncHandler(async (req, res, next) => {

    const {id} = req.params ;
    const categoryExist = await categoryModel.findById(req.params.categoryId);
    const subcategory = await subCategoryModel.findOneAndDelete({_id :id , createdBy : req.user._id }) ;
    
    if(!subcategory){
        return next(new AppError("subcategory is not exist or you don't have permission"))
    }
    
    //   delete from cloudinary 
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subcategory.customId}`)
    await cloudinary.api.delete_folder(`EcommerceC42/Categories/${categoryExist.customId}/subCategories/${subcategory.customId}`) ;
    res.json({msg : "done"}) ;

})