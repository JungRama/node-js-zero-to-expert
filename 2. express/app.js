const http      = require('http')
const express   = require('express')

const app       = express()

app.use((req, res, next) => {
    console.log('test');
    next()
})

app.use((req, res, next) => {
    res.send('<h1>tes</h1>')
})

app.listen(3001)