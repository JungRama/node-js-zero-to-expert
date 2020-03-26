const express   = require('express')
const router    = express.Router()

// CONTROLLER
const productController = require('../controller/productsController.js')
const cartController = require('../controller/cartController.js')
const orderController = require('../controller/orderController.js')

router.get('/', productController.getAllProduct)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.addCart)
router.post('/cart/delete', cartController.deleteCart)

router.get('/order', orderController.getOrder)
router.post('/order', orderController.addOrder)

module.exports = router