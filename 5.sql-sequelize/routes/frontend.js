const express   = require('express')
const router    = express.Router()

// CONTROLLER
const productController = require('../controller/frontend/productsController.js')
const cartController = require('../controller/frontend/cartController.js')
const orderController = require('../controller/frontend/orderController.js')

router.get('/', productController.getProduct)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.addCart)
router.post('/cart/delete', cartController.deleteCart)

router.get('/order', orderController.getOrder)
router.post('/order', orderController.addOrder)

module.exports = router