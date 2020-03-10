const Cart = require('../../models/cart')

exports.getCart = ( req, res, next ) => {
    Cart.getAllCart(cart =>{
        res.render('frontend/cart', {
            rName: 'frontCart',
            title: 'Cart',
            cartData : cart
        })
    })
}

exports.addCart = ( req, res, next ) => {
    console.log(req.body.id, req.body.productPrice);
    
    Cart.addProduct(req.body.id, req.body.productPrice)
    res.redirect('/')
}