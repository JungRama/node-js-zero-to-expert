const path          = require('path')
const express       = require('express')
const bodyParser    = require('body-parser')
// const expressHbs    = require('express-handlebars') // Add express handlebars
const routesAdmin   = require('./routes/admin')
const routesFront   = require('./routes/frontend')

const app           = express()

// SET TEMPLATE FOR EJS
app.set('view engine', 'ejs')

// SET TEMPLATE ENGINE USING HANDLEBARS
// app.engine('hbs', expressHbs())
// app.set('view engine', 'hbs')

// SET TEMPLATE ENGINE USING PUG
// app.set('view engine', 'pug')

// SET TEMPLATE FOLDER TO VIEWS
app.set('views', 'views') 

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