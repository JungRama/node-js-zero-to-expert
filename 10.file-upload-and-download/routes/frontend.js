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
router.get('/cart/checkout', authMiddleware, cartController.cartController)

router.get('/order', authMiddleware, orderController.getOrder)
router.get('/order/invoice/:id', authMiddleware, orderController.getInvoice)
router.post('/order', authMiddleware, orderController.addOrder)


module.exports = router