const User = require('../../models/user')
const Product = require('../../models/product')

exports.getCart = ( req, res, next ) => {

}

exports.addCart = ( req, res, next ) => {
    const productId = req.body.productId

    Product.getById(productId)
    .then(product => {
        return req.user.addCart(product)
    })
    .then(result => {
        res.redirect('/')
    })
}

exports.deleteCart = ( req, res, next ) => {

}