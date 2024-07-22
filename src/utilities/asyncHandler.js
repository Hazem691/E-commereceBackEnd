export const asyncHandler = (func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch((err)=>{
            next(err) ;
        })
    }
}

export const GlobalErrorHandler = (err , req , res, next) =>{
    res.status(err.statusCode || 500 ).json({msg : err.message}) ;
}