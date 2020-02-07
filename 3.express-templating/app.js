const path          = require('path')
const express       = require('express')
const routesAdmin   = require('./routes/admin')
const routesFront   = require('./routes/frontend')
const bodyParser    = require('body-parser')

const app           = express()

app.set('view engine', 'pug')
app.set('views', 'views') // Template Loaction

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(routesFront)
app.use('/admin', routesAdmin.router)

app.use((req, res, next) => {
    res.status(404).render('static/404', {
        rName: '',
        title: 'Page Not Founds'
    })
})

app.listen(3030)