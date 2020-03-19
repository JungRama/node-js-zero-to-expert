const path      = require('path')
const express   = require('express')
const router    = express.Router()

// CONTROLLER
const productController = require('../controller/admin/productsController')

router.get('/add-product', productController.indexAddProduct)
router.post('/add-product', productController.postAddProduct)

router.get('/product', productController.indexListProduct)

router.get('/product/:productID', productController.getProductDetail)
router.post('/edit-product', productController.postEditProduct)
router.post('/delete-product', productController.deleteProduct)

exports.router  = router