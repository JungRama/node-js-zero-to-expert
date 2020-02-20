const express   = require('express')
const router    = express.Router()

// CONTROLLER
const productController = require('../controller/productsController.js')

router.get('/', productController.getProduct)

module.exports = router