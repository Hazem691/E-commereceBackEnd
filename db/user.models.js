
import { Schema, model } from "mongoose";




const userSchema = new Schema({
    name : {
        type : String,
        required : [true , "name is required"],
        minLength : 3,
        maxLength : 15,
        trim: true,
    },
    email :{
        type : String,
        required : [true , "email is required"],
        lowercase : true,
        unique : true

    },
    password :{
        type : String,
        required :[true , "password is required"],
        trim : true ,
    },
    age :{
        type : Number,
        required : [true ,"age is required"],
    },
    phone:[String],
    address :[String],
    confirmed : {
        type : Boolean,
        default : false
    },
    loggedIn :{
        type : Boolean ,
        default : false
    },
    role :{
        type : String ,
        enum : ['admin' , 'user'] ,
        default : 'user',
    },
    code : String ,
    passwordChangedAt : Date ,
})


const userModel = model('user',userSchema) ;

export default userModel ;