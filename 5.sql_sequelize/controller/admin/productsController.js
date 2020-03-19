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

    req.user.createProduct({ // POST AUTOMATICALY ADD USER ID 
        title: request.title,
        description: request.description,
        price: request.price,
        image: request.image,
    })
    .then(res => {
        res.redirect('/admin/add-product')
    }).catch(err => {
        res.redirect('/admin/add-product')
        console.log(err);
    })
}

/* ------------------------------ EDIT PRODUCT ------------------------------ */
exports.postEditProduct = (req, res, next) => {
    const request = req.body
    Product.findByPk(request.id)
    .then(product => {
        product.title = request.title,
        product.description = request.description,
        product.price = request.price,
        product.image = request.image

        return product.save()
    })
    .then(() => {
        res.redirect('/admin/product')
    }).catch(err => {
        console.log(err);
    })
}

/* ------------------------------ DELETE PRODUCT ------------------------------ */
exports.deleteProduct = (req, res, next) => {
    Product.findByPk(req.body.id)
    .then(product => {
        return product.destroy()
    })
    .then(() => {
        res.redirect('/admin/product')
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ LIST PRODUCT ------------------------------ */
exports.indexListProduct = (req, res, next) => {
    req.user.getProducts() // GET ONLY THIS USER PRODUCT
    .then(productData => {
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
    Product.findByPk(id)
    .then(productData => {
        res.render('admin/edit-product', {
            rName: 'adminListProduct',
            product: productData,
            title: 'Edit Product',
        })
    })
}