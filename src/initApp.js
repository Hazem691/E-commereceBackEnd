import connectionDB from "../db/connection.js";
import { brandRouter, cartRouter, categroyRouter, couponRouter, orderRouter, productRouter, reviewRouter, subcategoryRouter, userRouter  } from "./modules/index.routes.js";
import wishlistRouter from "./modules/wishlist/wishlist.routes.js";
import { GlobalErrorHandler } from "./utilities/asyncHandler.js";
import { AppError } from "./utilities/classError.js"
import { deleteFromCloudinay } from "./utilities/deleteFromCloudinay.js";
import { deleteFromDB } from "./utilities/deleteFromDB.js";
import cors from 'cors'


export const initApp = (app,express) => {
    
    app.use(cors()) ;

    app.use((req,res,next)=>{
        if(req.originalUrl == '/order/webhook'){
            next();
        }else{
            express.json()(req,res,next)
        }
    }) ;

    app.get('/',(req,res)=>{
        res.json({msg : "hello"}) ;
    })
    app.use(userRouter) ;
    app.use("/categories",categroyRouter) ;
    app.use("/subcategories",subcategoryRouter) ;
    app.use(brandRouter) ;
    app.use('/product',productRouter) ;
    app.use('/coupon',couponRouter) ;
    app.use('/cart',cartRouter) ;
    app.use('/order',orderRouter) ;
    app.use('/review',reviewRouter) ;
    app.use('/wishlist',wishlistRouter)
    connectionDB()
    app.use('*',(req,res,next)=>{
        next(new AppError('invalid URL')) ;
    })
    app.use(GlobalErrorHandler  , deleteFromCloudinay ,deleteFromDB)
   
}