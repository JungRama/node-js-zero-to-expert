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
    const request = req.body
    const product = new Product(
        null,
        request.title,
        request.description,
        request.price,
        request.image,
        req.user._id
    )
    product.save()
    .then(response => {
        res.redirect('/admin/add-product')
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ EDIT PRODUCT ------------------------------ */
exports.postEditProduct = (req, res, next) => {
    const request = req.body

    const product = new Product(
        request.id,
        request.title,
        request.description,
        request.price,
        request.image,
        req.user._id
    )
    product.save()
    .then(response => {
        res.redirect('/admin/product')
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ DELETE PRODUCT ------------------------------ */
exports.deleteProduct = (req, res, next) => {
    Product.deleteById(req.body.id)
    .then(() => {
        res.redirect('/admin/product')
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ LIST PRODUCT ------------------------------ */
exports.indexListProduct = (req, res, next) => {
    Product.fetchAll()
    .then(productData => {
        res.render('admin/list-product', {
            rName: 'adminListProduct',
            products: productData,
            title: 'List Product',
        })
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ DETAIL PRODUCT ------------------------------ */
exports.getProductDetail = (req, res, next) => {
    const id = req.params.productID
    Product.getById(id)
    .then(productData => {
        res.render('admin/edit-product', {
            rName: 'adminListProduct',
            product: productData,
            title: 'Edit Product',
        })
    })
}