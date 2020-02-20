const Product = require('../models/product')

exports.indexAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        rName: 'adminAddProduct',
        title: 'Add Product'
    })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.product)
    product.save()
    
    res.redirect('/')
}

exports.getProduct = (req, res, next) => {
    const products = Product.fetchAll()

    res.render('frontend/index', {
        rName: 'frontShop',
        products: products,
        title: 'Shop',
        hasProducts: products.length > 0 ? true : false // Needed for handlebars template
    })
}