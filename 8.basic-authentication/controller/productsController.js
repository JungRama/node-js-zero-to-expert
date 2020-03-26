const Product = require('../models/product')

/* ------------------------------- ADD PRODUCT ------------------------------ */
exports.indexAddProduct = (req, res, next) => {
    if(!req.session.isLoggedIn){
        res.redirect('/login')
    }
    res.render('admin/add-product', {
        rName: 'adminAddProduct',
        title: 'Add Product'
    })
}

/* ------------------------------ ADD PRODUCT ------------------------------ */
exports.postAddProduct = (req, res, next) => {
    const request = req.body
    const product = new Product({
        title: request.title,
        description: request.description,
        price: request.price,
        image: request.image,
        userId: req.user._id
    })
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

    const product = new Product({
        title: request.title,
        description: request.description,
        price: request.price,
        image: request.image
    })
    Product.findById(request.id)
    .then(product => {
        product.title = request.title,
        product.description = request.description,
        product.price = request.price,
        product.image = request.image

        return product.save()
    })
    .then(response => {
        res.redirect('/admin/product')
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ DELETE PRODUCT ------------------------------ */
exports.deleteProduct = (req, res, next) => {
    Product.findByIdAndRemove(req.body.id)
    .then(() => {
        res.redirect('/admin/product')
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ LIST PRODUCT USER ------------------------------ */
exports.listProductUser = (req, res, next) => {
    Product.find()
    .where({userId: req.user._id})
    .then(productData => {
        console.log(productData);
        
        res.render('admin/list-product', {
            rName: 'adminListProduct',
            products: productData,
            title: 'List Product',
        })
    })
}

/* ------------------------------ DETAIL PRODUCT ------------------------------ */
exports.getProductDetail = (req, res, next) => {
    const id = req.params.productID
    Product.findById(id)
    .then(productData => {
        res.render('admin/edit-product', {
            rName: 'adminListProduct',
            product: productData,
            title: 'Edit Product',
        })
    })
}

/* -------------------------- FRONTEND LIST PRODUCT ------------------------- */
exports.getAllProduct = (req, res, next) => {
    Product.find()
    .populate('userId')
    .then(productData => {
        res.render('frontend/index', {
            rName: 'frontShop',
            products: productData,
            title: 'List Product',
        })
    })
}