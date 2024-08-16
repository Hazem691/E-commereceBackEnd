
import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";



const reviewSchema = new Schema({
    comment : {
        type : String ,
        required : [true , "comment is required"] ,
        minLength : 3 , 
        trim : true
    } , 
    rate : {
        type : Number , 
        required :[true , "rate is required.."] ,
        min : 1 ,
        max : 5 ,
    },
    createdBy : {
        type : mongoose.Types.ObjectId ,
        ref : "user" ,
        required : true ,
    },
    productId : {
        type : mongoose.Types.ObjectId,
        ref : "product",
        required : true
    } ,
    orderId : {
        type : mongoose.Types.ObjectId ,
        ref : "order"
    }
}) 


const  reviewModel = model('review' , reviewSchema) ;

export default reviewModel ;