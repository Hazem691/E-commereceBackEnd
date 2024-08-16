import jwt from 'jsonwebtoken';
import userModel from '../../db/user.models.js';


export const auth = () => {
    return async (req, res, next) => {
        try {
            const {token} = req.headers;
            
            if (!token) {
                return res.status(401).json({ msg: "Token does not exist" });
            }

            const decoded = jwt.verify(token,process.env.signatureKey);
           
            if (!decoded) {
                return res.status(401).json({ msg: "Invalid payload" });
            }

            

            const user = await userModel.findOne({email:decoded.email});

            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            if(parseInt(user?.passwordChangedAt?.getTime()/1000) > decoded.iat ){
                return res.json({msg : "Token has expired please loggin again ......"}) ;
            }

            req.user = user;
            
            next();
        } catch (err) {
            console.error('Error authenticating user:', err);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    };
};


export const authorization = (roles = [])=>{
    return async(req,res,next)=>{
        try{
            const {role} = req.user ;
          
       
            if(!roles.includes(role)){
                res.json({msg : "You don't have permisson to do that"})
            }else{
                next() ;
            }
        }catch(err){
            res.json({msg :"There is an error",err :err}) ;
        }
    }
}
