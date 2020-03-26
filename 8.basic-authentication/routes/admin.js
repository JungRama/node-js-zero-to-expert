const express   = require('express')
const router    = express.Router()

/* ------------------------------- MIDDLEWARE ------------------------------- */
const authMiddleware = require('../middleware/auth')
/* ------------------------------- CONTROLLER ------------------------------- */
const productController = require('../controller/productsController')

router.get('/add-product', authMiddleware, productController.indexAddProduct)
router.post('/add-product', authMiddleware, productController.postAddProduct)

router.get('/product', authMiddleware, productController.listProductUser)

router.get('/product/:productID', authMiddleware, productController.getProductDetail)
router.post('/edit-product', authMiddleware, productController.postEditProduct)
router.post('/delete-product', authMiddleware, productController.deleteProduct)

exports.router  = router