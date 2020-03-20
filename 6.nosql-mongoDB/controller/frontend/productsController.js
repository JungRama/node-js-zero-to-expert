const Product = require('../../models/product')

exports.getProduct = (req, res, next) => {
    Product.fetchAll()
    .then(productData => {
        res.render('frontend/index', {
            rName: 'frontShop',
            products: productData,
            title: 'Shop',
        })
    })
    .catch(err => {
        console.log(err);
    })
}