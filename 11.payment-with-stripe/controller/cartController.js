const Order = require('../models/order')

const stripeKey = 'stripe_key_sk_test_rWaaaeEz82oNNKs2250R0Tl700yva5Pvsz'.split('stripe_key_')[1]
const stripe = require('stripe')(stripeKey);

exports.getCart = ( req, res, next ) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(products => {
        res.render('frontend/cart', {
            rName: 'frontCart',
            title: 'Cart',
            cartData : products.cart.items
        })
    })
}

exports.addCart = ( req, res, next ) => {
    const productId = req.body.productId
     req.user.addToCart(productId)
    .then(result => {
        res.redirect('/')
    })
}

exports.deleteCart = ( req, res, next ) => {
    req.user.deleteCart(req.body.id)
    .then(result => {
        res.redirect('/cart')
    })
}

/* -------------------------------- CHECKOUT -------------------------------- */

exports.getCheckout = ( req, res, next ) => {
    let productsData
    let totalPrice = 0;

    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(async products => {
        productsData = products.cart.items
        totalPrice = 0;
        
        await products.cart.items.forEach(item => {
            totalPrice += item.quantity * item.productId.price
        });

        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: productsData.map(product => {
                return {
                    name: product.productId.title,
                    description: product.productId.description,
                    amount: product.productId.price,
                    currency: 'idr',
                    quantity: product.quantity
                }
            }),
            success_url: process.env.baseURL + 'cart/checkout/success',
            cancel_url: process.env.baseURL + 'cart/checkout/failed'
        })
    })
    .then(stripeSession => {
        res.render('frontend/checkout', {
            rName: 'frontCart',
            title: 'Cart',
            cartData : productsData,
            totalPrice,
            sessionId: stripeSession.id
        })
    })
}

exports.getCheckoutSuccess = ( req, res, next ) => {
    const order = new Order({
        items: req.user.cart.items,
        userId: req.user._id
    })
    
    order.save()
    .then(result => {
        req.user.cart.items = []
        req.user.save()
    })
    .then(() => {
        res.redirect('/order')
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getCheckoutFailed = ( req, res, next ) => {
    res.redirect('/cart/checkout')
}