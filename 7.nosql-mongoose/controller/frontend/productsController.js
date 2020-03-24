const Product = require('../../models/product')

exports.getProduct = (req, res, next) => {
    Product.find()
    .then(productData => {
        res.render('frontend/index', {
            rName: 'frontShop',
            products: productData,
            title: 'List Product',
        })
    })
}