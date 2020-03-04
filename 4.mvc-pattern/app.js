const path          = require('path')
const express       = require('express')
const bodyParser    = require('body-parser')
var sassMiddleware  = require('node-sass-middleware');

const routesAdmin   = require('./routes/admin')
const routesFront   = require('./routes/frontend')

const app           = express()

// USING SASS
app.use(sassMiddleware({
    src: __dirname + '/public', //where the sass files are 
    dest: __dirname + '/public', //where css should go
    debug: true
}));

// SET TEMPLATE FOR EJS
app.set('view engine', 'ejs')

// SET TEMPLATE FOLDER TO VIEWS
app.set('views', 'views') 

app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, 'public')))

// ROUTER FOR FRONT
app.use(routesFront)
// ROUTER FOR ADMIN
app.use('/admin', routesAdmin.router)

app.use((req, res, next) => {
    res.status(404).render('static/404', {
        rName: '',
        title: 'Page Not Founds'
    })
})

app.listen(3030)