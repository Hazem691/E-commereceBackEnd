import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema({
    user : {
        type : mongoose.Types.ObjectId ,
        ref : "user" , 
        required : true,
    },
    products :[{
        productId : {type : mongoose.Types.ObjectId , required : true , ref : "product"} , 

        quantity : {type : Number , required : true} ,
    }]
},
    { timestamps: true }
) ;


const cartModel = model('cart',cartSchema) ;

export default cartModel ;