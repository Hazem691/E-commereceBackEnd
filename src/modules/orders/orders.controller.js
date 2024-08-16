
import Stripe from "stripe";
import cartModel from "../../../db/cart.model.js";
import couponModel from "../../../db/coupon.model.js";
import orderModel from "../../../db/order.model.js";
import productModel from "../../../db/product.model.js";
import { sendEmail } from "../../services/sendEmail.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { AppError } from "../../utilities/classError.js";
import { payment } from "../../utilities/payment.js";
import { createInvoice } from "../../utilities/pdf.js";

import path from 'path'

//&-----------------------------------------------  Create Order ---------------------------------------------------

export const createOrder = asyncHandler(async (req, res, next) => {
    const { productId, quantity, couponCode, address, phone, paymentMethod } = req.body;
    if (couponCode) {
        const coupon = await couponModel.findOne({ code: couponCode.toLowerCase(), usedBy: { $nin: [req.user._id] } });
        if (!coupon || coupon.toDate < Date.now()) {
            return next(new AppError('coupon is not exist or expired'))
        }
        req.body.coupon = coupon;
    }
    let products = [];
    let flag = false;
    if (productId) {
        const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } });
        if (!product) {
            return next(new AppError('product is not exist or out of stock...'));
        }
        products = [{ productId, quantity }];

    } else {
        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart.products.length) {
            return next(new AppError('cart is empty please select products...'));
        }
        products = cart.products; //*--------------------------------  BSON  ----------------------------
        flag = true;
    }
    let finalProducts = [];
    let subPrice = 0;
    for (let product of products) {
        const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } });
        if (!checkProduct) {
            return next(new AppError('product is not exist or out of stock...'));
        }
        if (flag) {
            product = product.toObject();
        }

        product.title = checkProduct.title;
        product.price = checkProduct.price;
        product.finalPrice = checkProduct.subPrice * product.quantity;
        subPrice += product.finalPrice;

        finalProducts.push(product);

    }

    const order = await orderModel.create({
        user: req.user._id,
        products: finalProducts,
        subPrice: subPrice,
        couponId: req.body?.coupon?._id,
        totalPrice: subPrice - subPrice * ((req.body.coupon?.amount) || 0 / 100),
        address,
        phone,
        paymentMethod,
        status: paymentMethod == 'cash' ? "placed" : "waitpayment",
    })
    if (req.body?.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id },
            { $push: { usedBy: req.user._id } }
        );
    }
    for (let product of products) {
        await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: -product.quantity } });
    }

    if (flag) {
        await cartModel.updateOne({ user: req.user._id },
            {
                products: [],
            }
        )
    }

    const invoice = {
        shipping: {
          name: req.user.name,
          address: req.user.address,
          city: "Alexandria",
          state: "Al",
          country: "Eg",
          postal_code: 94111
        },
        items: order.products,
        subtotal: order.subPrice,
        paid: order.totalPrice,
        invoice_nr: order._id ,
        date : order.createdAt ,
        coupon : req.body?.coupon?.amount || 0
      };

      await createInvoice(invoice, "invoice.pdf");

      await sendEmail(req.user.email , "Order placed" , `your order has been placed successfully` , [{
        path : "invoice.pdf" ,
        contentType : "application/pdf"
      }, {
        path : "shopLogo.png" ,
        contentType : "image/png"
      }] )

    if(paymentMethod == 'card'){
        const stripe = new Stripe(process.env.stripe_secret)
        if(req.body?.coupon){
           const coupon = await stripe.coupons.create({
              percent_off  : req.body.coupon.amount ,
              duration : "once"
           })

           req.body.couponId = coupon.id
        }
        const session = await payment({
            stripe ,
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: req.user.email,
            metadata: {
                orderId: order._id.toString()
            },
            success_url: `${req.protocol}://${req.headers.host}/orders/success/${order._id}`,
            cancel_url: `${req.protocol}://${req.headers.host}/orders/cancel/${order._id}`,
            line_items: order.products.map((product) => {
                return {
                    price_data: {
                        currency: "EGP",
                        product_data: {
                            name: product.title,
    
                        },
                        unit_amount: product.price * 100,
    
                    },
                    quantity: product.quantity
                }
            }),
            discounts: req.body?.coupon ? [{coupon : req.body.couponId}] :  [] ,
            
        })
        res.json({ msg: "done", url : session.url  ,session});
    }
 
    res.json({ msg: "done", order });




})



export const webhook = asyncHandler(async (req, res,next) => {
    const stripe = new Stripe(process.env.stripe_secret)
    const sig = req.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    
    if(event.type != 'checkout.session.completed' ) {
        const {orderId} = event.data.object.metadata
        await orderModel.findOneAndUpdate({_id : orderId} , {status : 'rejected'}) ;
        res.json({msg : "failed"})

       
   
      
      
    }else{
        const {orderId} = event.data.object.metadata
        await orderModel.findOneAndUpdate({_id : orderId} , {status : 'placed'}) ;
        res.json({msg : "done"})

    }
  
  })

//&-----------------------------------------------  Cancel Order ---------------------------------------------------


export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reason } = req.body;
    const order = await orderModel.findOne({ _id: id, user: req.user._id });
    if (!order) {
        return next(new AppError('Order is not exist ...'));
    }
    if ((order.paymentMethod == "cash" && order.status !== 'placed') || (order.paymentMethod == 'card' && order.status !== 'waitpayment')) {
        return next(new AppError("you can't cancel the order..."));
    }
    await orderModel.updateOne({ _id: id }, {
        status: 'cancelled',
        cancelledBy: req.user._id,
        reason: reason
    });

    if (order?.couponId) {
        await couponModel.updateOne({ _id: order?.couponId }, { $pull: { usedBy: req.user._id } });
    }


    for (let product of order.products) {
        await productModel.updateOne({ _id: product.productId }, {
            $inc: { stock: product.quantity }
        })
    }

    res.json({ msg: 'done' });
})



//&-----------------------------------------------  Get Order ---------------------------------------------------


export const getOrder = asyncHandler(async (req, res, next) => {
    const order = await orderModel.find({});
    if (!order) {
        return next(new AppError("there are no orders...."));
    }
    if (order.cancelledBy) {
        return next(new AppError("Order is cancelled..."));
    }

    res.json({ msg: "done", order });
})