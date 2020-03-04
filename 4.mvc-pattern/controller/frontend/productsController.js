const Product = require('../../models/product')

exports.getProduct = (req, res, next) => {
    Product.fetchAll(productData => {
        res.render('frontend/index', {
            rName: 'frontShop',
            products: productData,
            title: 'Shop',
            hasProducts: productData.length > 0 ? true : false // Needed for handlebars template
        })
    })
}