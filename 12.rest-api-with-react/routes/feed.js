const express = require('express')

const feedController = require('../controller/feedController')

router = express.Router()

router.get('/post', feedController.getFeed)
router.post('/post', feedController.postFeed)

module.exports = router