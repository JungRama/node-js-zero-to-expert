const express   = require('express')
const router    = express.Router()

/* ------------------------------- MIDDLEWARE ------------------------------- */
const authMiddleware = require('../middleware/auth')
/* ------------------------------- CONTROLLER ------------------------------- */
const productController = require('../controller/productsController.js')
const cartController = require('../controller/cartController.js')
const orderController = require('../controller/orderController.js')

router.get('/', productController.getAllProduct)

router.get('/cart', authMiddleware, cartController.getCart)
router.post('/cart', authMiddleware, cartController.addCart)
router.post('/cart/delete', authMiddleware, cartController.deleteCart)

router.get('/cart/checkout', authMiddleware, cartController.getCheckout)
router.get('/cart/checkout/success', authMiddleware, cartController.getCheckoutSuccess)
router.get('/cart/checkout/failed', authMiddleware, cartController.getCheckoutFailed)

router.get('/order', authMiddleware, orderController.getOrder)
router.get('/order/invoice/:id', authMiddleware, orderController.getInvoice)


module.exports = router