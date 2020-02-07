const path      = require('path')
const express   = require('express')
const router    = express.Router()

const products   = []

router.get('/add-product', (req, res, next) => {
    res.render('admin/add-product', {
        rName: 'adminAddProduct',
        products: products,
        title: 'Add Product'
    })
})

router.post('/add-product', (req, res, next) => {
    products.push({
        title : req.body.product
    })
    res.redirect('/')
})

exports.router  = router
exports.products = products