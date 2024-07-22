import mongoose  from "mongoose";



const connectionDB = async ()=>{

    return await mongoose.connect(process.env.DB_URL) ;

}

export default connectionDB;