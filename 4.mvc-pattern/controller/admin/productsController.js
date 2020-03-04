const Product = require('../../models/product')

/* ------------------------------- ADD PRODUCT ------------------------------ */
exports.indexAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        rName: 'adminAddProduct',
        title: 'Add Product'
    })
}
exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.product, req.body.price)
    product.save()
    res.redirect('/admin/list-product')
}

/* ------------------------------ LIST PRODUCT ------------------------------ */
exports.indexListProduct = (req, res, next) => {
    Product.fetchAll(productData => {
        res.render('admin/list-product', {
            rName: 'adminListProduct',
            products: productData,
            title: 'List Product',
            hasProducts: productData.length > 0 ? true : false // Needed for handlebars template
        })
    })
}