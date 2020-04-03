const express = require('express')
// const bodyParse = require()

const routerFeed = require('./routes/feed')
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // website.com
    res.setHeader('Access-Control-Allow-Methods', '*') // post, put, delete, get
    res.setHeader('Access-Control-Allow-Headers', '*') // Content-type, authorization
    next()
})

app.use(routerFeed)

app.listen(8080)