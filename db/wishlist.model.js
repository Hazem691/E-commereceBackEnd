import mongoose, { Schema, model } from "mongoose";



const wishlistSchema = new Schema({
    user : {
        type : mongoose.Types.ObjectId , 
        ref : "user" ,
        required : true ,
    } , 
    products : [{
        type : mongoose.Types.ObjectId ,
        ref : "product" , 
        required : true
    }]
})

const wishlistModel = model('wishlist' , wishlistSchema) ;

export default wishlistModel ;