const path      = require('path')
const admin     = require('./admin')
const express   = require('express')
const router    = express.Router()

router.get('/', (req, res, next) => {
    res.render('frontend/index', {
        rName: 'frontShop',
        products: admin.products,
        title: 'Shop',
        hasProducts: admin.products.length > 0 ? true : false
    })
    console.log(admin.products);
})

module.exports = router