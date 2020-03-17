const express   = require('express')
const router    = express.Router()

// CONTROLLER
const productController = require('../controller/frontend/productsController.js')
const cartController = require('../controller/frontend/cartController.js')

router.get('/', productController.getProduct)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.addCart)

module.exports = router