const path      = require('path')
const express   = require('express')
const router    = express.Router()

// CONTROLLER
const productController = require('../controller/productsController.js')

router.get('/add-product', productController.indexAddProduct)

router.post('/add-product', productController.postAddProduct)

exports.router  = router