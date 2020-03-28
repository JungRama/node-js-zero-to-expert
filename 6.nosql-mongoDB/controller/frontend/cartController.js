const User = require('../../models/user')

exports.getCart = ( req, res, next ) => {
    req.user.getCart()
    .then(products => {
        res.render('frontend/cart', {
            rName: 'frontCart',
            title: 'Cart',
            cartData : products
        })
    })
}

exports.addCart = ( req, res, next ) => {
    const productId = req.body.productId
     req.user.addCart(productId)
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