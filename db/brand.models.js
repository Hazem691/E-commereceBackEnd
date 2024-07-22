import mongoose, { Schema, model } from "mongoose";



const brandSchema = new Schema({
    name : {
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
    createdBy : {
        type : mongoose.Types.ObjectId ,
        ref : "user",
        required : true
    } ,
    image :{
        secure_url : String ,
        public_id : String
    },
    customId : String
})


const brandModel = model('brand' , brandSchema) ;
export default brandModel ;