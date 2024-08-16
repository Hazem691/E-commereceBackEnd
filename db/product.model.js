import mongoose, { Schema, model } from "mongoose";



const productSchema = new Schema({
    title : {
        type : String,
        required : [true , "name is required"],
        minLength : 3,
        maxLength : 30,
        lowercase : true,
        trim: true,
        unique : true
    },
    slug :{
        type : String ,
        minLength : 3,
        maxLength : 30,
        trim: true,
        unique : true ,
    },
    description : {
        type : String ,
        minLength : 3 ,
        trim : true

    },
    category : {
        type : mongoose.Types.ObjectId,
        ref : "category"

    },
    subCategory : {
        type : mongoose.Types.ObjectId,
        ref : "subCategory"

    },
    brand : {
        type : mongoose.Types.ObjectId,
        ref : "brand"

    },
    createdBy : {
        type : mongoose.Types.ObjectId ,
        ref : "user",
        required : true
    } ,
    image :{
        secure_url : String ,
        public_id : String
    },
    coverImages :[{
        secure_url : String ,
        public_id : String
    }],
     price : {
        type : Number,
        required : true,
        min : 1 ,

     },
     discount :{
        type : Number ,
        min : 1 ,
        max : 100 ,
     },
     subPrice :{

        type : Number ,
        default : 1

     },
     stock :{
        type : Number ,
        default : 1,
        required : true

     },
     rateAvg :{
        type : Number,
        default : 0 

     },
     rateNum : {
           type : Number ,
           default : 0 ,
     },
    customId : String
})


const productModel = model('product' , productSchema) ;
export default productModel ;