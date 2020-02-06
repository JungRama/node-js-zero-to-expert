const path          = require('path')
const express       = require('express')
const routesAdmin   = require('./routes/admin')
const routesFront   = require('./routes/frontend')
const bodyParser    = require('body-parser')

const app           = express()

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(routesFront)
app.use('/admin', routesAdmin)

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'static', '404.html'))
})

app.listen(3030)