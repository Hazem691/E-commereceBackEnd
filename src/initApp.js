import connectionDB from "../db/connection.js";
import { brandRouter, categroyRouter, subcategoryRouter, userRouter } from "./modules/index.routes.js";
import { GlobalErrorHandler } from "./utilities/asyncHandler.js";
import { AppError } from "./utilities/classError.js"



export const initApp = (app,express) => {
    const port = 5000 ;

    app.use(express.json()) ;
    app.use(userRouter) ;
    app.use("/categories",categroyRouter) ;
    app.use("/subcategories",subcategoryRouter) ;
    app.use(brandRouter) ;
    connectionDB()
    app.use('*',(req,res,next)=>{
        next(new AppError('invalid URL')) ;
    })
    app.use(GlobalErrorHandler)
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}