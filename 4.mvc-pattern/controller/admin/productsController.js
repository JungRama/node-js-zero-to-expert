const Product = require('../../models/product')

/* ------------------------------- ADD PRODUCT ------------------------------ */
exports.indexAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        rName: 'adminAddProduct',
        title: 'Add Product'
    })
}

/* ------------------------------ ADD PRODUCT ------------------------------ */
exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.image, req.body.product, parseInt(req.body.price))
    product.save()
    res.redirect('/admin/product')
}

/* ------------------------------ EDIT PRODUCT ------------------------------ */
exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.id, req.body.image, req.body.product, parseInt(req.body.price))
    product.save()
    res.redirect('/admin/product')
}

/* ------------------------------ DELETE PRODUCT ------------------------------ */
exports.deleteProduct = (req, res, next) => {
    Product.delete(req.body.id)
    res.redirect('/admin/product')
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


/* ------------------------------ DETAIL PRODUCT ------------------------------ */
exports.getProductDetail = (req, res, next) => {
    const id = req.params.productID
    Product.findByID(id, productData => {
        res.render('admin/edit-product', {
            rName: 'adminListProduct',
            product: productData,
            title: 'Edit Product',
        })
    })
}