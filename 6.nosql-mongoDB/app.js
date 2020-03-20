/* --------------------------------- LIBRARY -------------------------------- */
const path          = require('path')
const express       = require('express')
const bodyParser    = require('body-parser')
var sassMiddleware  = require('node-sass-middleware');
/* --------------------------------- END LIBRARY -------------------------------- */

/* --------------------------------- ROUTER --------------------------------- */
const routesAdmin   = require('./routes/admin') 
const routesFront   = require('./routes/frontend')
/* --------------------------------- END ROUTER --------------------------------- */

/* --------------------------------- HELPERS -------------------------------- */
const monggoConnect = require('./helpers/database').monggoConnect
/* --------------------------------- END HELPERS -------------------------------- */

/* ---------------------------------- MODEL --------------------------------- */
const User          = require('./models/user')
/* ---------------------------------- END MODEL --------------------------------- */

const app           = express()

app.use((req, res, next) => {
    User.getById("5e734788a7a5fc13e68c7b36")
    .then(user => {
        req.user = new User(user._id, user.username, user.email, user.cart);
        next()
    })
    .catch(err => {
        console.log(err)
    })
})

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

app.use(routesFront) // ROUTER FOR FRONT
app.use('/admin', routesAdmin.router) // ROUTER FOR ADMIN

app.use((req, res, next) => {
    res.status(404).render('static/404', {
        rName: '',
        title: 'Page Not Founds'
    })
})

monggoConnect(() =>{
    app.listen(3030)
})