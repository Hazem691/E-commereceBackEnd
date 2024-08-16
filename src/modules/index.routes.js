import userRouter from "./users/user.routes.js";
import categroyRouter from "./category/category.routes.js";

import brandRouter from "./brand/brand.routes.js";
import subcategoryRouter from "./subcategory/subcategory.routes.js";
import productRouter from "./product/product.routes.js";
import couponRouter from "./Coupon/coupon.routes.js";
import orderRouter from "./orders/orders.routes.js";
import cartRouter  from "./cart/cart.routes.js";
import reviewRouter from "./review/review.routes.js";
import wishlistRouter from "./wishlist/wishlist.routes.js";



export{
    userRouter,
    categroyRouter,
    subcategoryRouter, 
    brandRouter,
    productRouter,
    couponRouter ,
    cartRouter,
    orderRouter,
    reviewRouter,
    wishlistRouter
    
}