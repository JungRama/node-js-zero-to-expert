/* --------------------------------- LIBRARY -------------------------------- */
const path          = require('path')
const express       = require('express')
const bodyParser    = require('body-parser')
const sassMiddleware = require('node-sass-middleware');
const mongoose      = require('mongoose')
const session       = require('express-session')
const MongoSession  = require('connect-mongodb-session')(session)
const crsf          = require('csurf')
const flash         = require('connect-flash')
/* --------------------------------- END LIBRARY -------------------------------- */

/* --------------------------------- ROUTER --------------------------------- */
const routesAdmin   = require('./routes/admin') 
const routesFront   = require('./routes/frontend')
const routesAuth    = require('./routes/auth')
/* --------------------------------- END ROUTER --------------------------------- */

/* --------------------------------- HELPERS -------------------------------- */
require('dotenv').config()
/* --------------------------------- END HELPERS -------------------------------- */

/* ---------------------------------- MODEL --------------------------------- */
const User          = require('./models/user')
/* ---------------------------------- END MODEL --------------------------------- */

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
app.locals.inspect = require('util').inspect;

const csrfProtection = crsf()

/* ----------------------------- EXPRESS SESSION ---------------------------- */
const store = new MongoSession({
    uri: process.env.DB_ACCESS,
    collection: 'sessions',
})

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
/* ----------------------------- EXPRESS SESSION ---------------------------- */

app.use(csrfProtection) // INISIATE CSRF AFTER SESSION
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) {
        res.locals = {
            isAlreadyLogin : false,
        }
        next();
    }else{
        User.findById(req.session.user)
        .then(user => {
            req.user = user
            res.locals = {
                isAlreadyLogin : true,
            }
            next()
        })
        .catch(err => {
            console.log(err)
        })
    }
})

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next()
})

/* ------------------------------ DEFINE ROUTE ------------------------------ */
app.use(routesFront) // ROUTER FOR FRONT
app.use(routesAuth) // ROUTER FOR FRONT
app.use('/admin', routesAdmin.router) // ROUTER FOR ADMIN
/* ------------------------------ DEFINE ROUTE ------------------------------ */

app.use((req, res, next) => {
    res.status(404).render('static/404', {
        rName: '',
        title: 'Page Not Founds'
    })
})

/* ------------------------------ CONNECT DB ------------------------------ */
mongoose.connect(process.env.DB_ACCESS).then(res => {
    app.listen(3030)
}).catch(err => { 
    console.log(err);
})