const Product = require('../models/product')

exports.indexAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        rName: 'adminAddProduct',
        title: 'Add Product'
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.product, req.body.price)
    product.save()
    
    res.redirect('/')
}

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