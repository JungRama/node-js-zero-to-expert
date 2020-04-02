const Product = require('../models/product')

const fileSystem = require('fs')
const Validation = require('../helpers/validation')
const Joi = require('joi')

/* ------------------------------- ADD PRODUCT ------------------------------ */
exports.indexAddProduct = (req, res, next) => {
    if(!req.session.isLoggedIn){
        res.redirect('/login')
    }

    res.render('admin/add-product', {
        rName: 'adminAddProduct',
        title: 'Add Product',
        message: req.flash('message'),
        oldForm: req.flash('oldForm')
    })
}

/* ------------------------------ ADD PRODUCT ------------------------------ */
exports.postAddProduct = (req, res, next) => {
    const request = req.body
    console.log(req.files);

    const image = req.files.image
    const imageUrl = 'images/' + new Date().toISOString() + '-' + image.name
    image.mv('./'+imageUrl)
    
    const validation = Validation.validate({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
    }, request);
    
    if(validation.length > 0){
        req.flash('message', validation)
        req.flash('oldForm', req.body)
        res.redirect('/admin/add-product')
    }

    const product = new Product({
        title: request.title,
        description: request.description,
        price: request.price,
        image: imageUrl,
        userId: req.user._id
    })
    product.save()
    .then(response => {
        req.flash('message', {
            type: 'is-success',
            text: 'Success Add Product'
        })
        res.redirect('/admin/add-product')
    })
    .catch(err => {
        console.log({test : err});
    })
}

/* ------------------------------ EDIT PRODUCT ------------------------------ */
exports.postEditProduct = (req, res, next) => {
    const request = req.body
    console.log(req.files);
    
    Product.findOne({_id: request.id, userId: req.user._id})
    .then(product => {
        if(product.userId.toString() != req.user._id.toString()){
            res.redirect('/admin/product')
        }

        product.title = request.title
        product.description = request.description
        product.price = request.price
        if(req.files){
            fileSystem.unlinkSync(product.image)

            const image = req.files.image
            const imageUrl = 'images/' + new Date().toISOString() + '-' + image.name
            image.mv('./'+imageUrl)

            product.image = imageUrl
        }

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
    Product.findOne({_id: req.body.id, userId: req.user._id})
    .then(product => {
        Product.deleteOne({_id: req.body.id, userId: req.user._id})
        .then(() => {
            fileSystem.unlinkSync(product.image)
            
            res.redirect('/admin/product')
        })
    })
    .catch(err => {
        console.log(err);
    })
}

/* ------------------------------ LIST PRODUCT USER ------------------------------ */
exports.listProductUser = (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const item_perpage = 4
    let totalProduct

    Product.find()
    .where({userId: req.user._id})
    .countDocuments().then(countProduct => {
        totalProduct = countProduct

        return Product.find()
        .where({userId: req.user._id})
        .skip((page - 1) * item_perpage)
        .limit(item_perpage)
        .populate('userId')
    })
    .then(productData => {
        res.render('admin/list-product', {
            rName: 'adminListProduct',
            products: productData,
            title: 'List Product',
            pagination: {
                base: '/admin/product/',
                currentPage: page,
                total: totalProduct,
                hasPrev: page > 1,
                hasNext: item_perpage * page < totalProduct,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalProduct / item_perpage)
            }
        })
    })
}

/* ------------------------------ DETAIL PRODUCT ------------------------------ */
exports.getProductDetail = (req, res, next) => {
    const id = req.params.productID
    Product.findById(id)
    .then(productData => {
        if(productData.userId.toString() != req.user._id.toString()){
            res.redirect('/admin/product')
        }
        res.render('admin/edit-product', {
            rName: 'adminListProduct',
            product: productData,
            title: 'Edit Product',
        })
    })
}

/* -------------------------- FRONTEND LIST PRODUCT ------------------------- */
exports.getAllProduct = (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const item_perpage = 4
    let totalProduct

    Product.find()
    .countDocuments().then(countProduct => {
        totalProduct = countProduct

        return Product.find()
        .skip((page - 1) * item_perpage)
        .limit(item_perpage)
        .populate('userId')
    })
    .then(productData => {
        res.render('frontend/index', {
            rName: 'frontShop',
            products: productData,
            title: 'Shop Frontend',
            pagination: {
                base: '/',
                currentPage: page,
                total: totalProduct,
                hasPrev: page > 1,
                hasNext: item_perpage * page < totalProduct,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalProduct / item_perpage)
            }
        })
    })
}