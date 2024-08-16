
import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema({
    user :{
        type : mongoose.Types.ObjectId ,
        ref : "user",
        required : true
    } , 
    products : [{
        title : {type : String , required : true} , 
        productId : {type : mongoose.Types.ObjectId ,ref : "product", required : true},
        quantity : {type : Number , required : true} , 
        price : {type : Number , required : true} ,
        finalPrice : {type : Number , required : true}
    }]  ,
    subPrice : {
        type : Number , 
        required : true ,
    },
    couponId : {
        type : mongoose.Types.ObjectId ,
        ref : "coupon"
    } , 
    totalPrice : {
        type : Number ,
        required : true
    } ,
    address : {
        type : String ,
        required : true
    } , 
    phone :{
        type : String ,
        required : true
    } ,
    paymentMethod : {
        type : String ,
        required : true ,
        enum : ["card" , "cash"] ,
    } ,
    status : {
        type : String ,
        enum : ['placed' , 'waitpayment' , 'delivered' , 'onway' , 'cancelled' , 'rejected'] ,
        default : 'placed'
    },
    cancelledBy : {
        type : mongoose.Types.ObjectId ,
        ref : 'user'
    },
    reason : {
        type : mongoose.Types.ObjectId ,

    }

} , {
    timestamps : true
})


const orderModel = model('order' , orderSchema) ;
export default orderModel ;