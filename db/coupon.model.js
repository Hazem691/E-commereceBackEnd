import mongoose, { Schema, model } from "mongoose";



const couponSchema = new Schema({
    code : {
        type : String ,
        required : [true , "code is required"] ,
        minLength : 3 , 
        maxLength : 30 ,
        trim : true ,
        lowercase : true ,
        unique : true ,
    },
    amount : {
        type : Number ,
        required : [true , "amount is required"] ,
        min : 1 ,
        max : 100
    },
    createdBy :{
        type : mongoose.Types.ObjectId ,
        ref :"user",
        required : true ,
    },
    usedBy :[{
        type : mongoose.Types.ObjectId ,
        ref : "user",
    }] ,
    fromDate: {
        type : Date ,
        required : [true , "fromDate is required"],
    },
    toDate :{
        type :Date ,
        required : [true , "toDate is required"] ,
    }
}) ;


const couponModel = model('coupon',couponSchema) ;

export default couponModel ;