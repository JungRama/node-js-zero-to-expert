const express   = require('express')
const router    = express.Router()

// CONTROLLER
const productController = require('../controller/frontend/productsController.js')

router.get('/', productController.getProduct)

module.exports = router