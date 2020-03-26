/* --------------------------------- LIBRARY -------------------------------- */
const path          = require('path')
const express       = require('express')
const bodyParser    = require('body-parser')
const sassMiddleware = require('node-sass-middleware');
const mongoose      = require('mongoose')
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

app.use((req, res, next) => {
    User.findById("5e78b63be172c30e23e5b7d7")
    .then(user => {
        req.user = user
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
app.use(routesAuth) // ROUTER FOR FRONT
app.use('/admin', routesAdmin.router) // ROUTER FOR ADMIN

app.use((req, res, next) => {
    res.status(404).render('static/404', {
        rName: '',
        title: 'Page Not Founds'
    })
})

mongoose.connect(process.env.DB_ACCESS).then(res => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: 'Jung Rama',
                email: 'jungrama.id@gmail.com',
                cart: {
                    items: []
                }
            })
            user.save()
            .then(() =>{
                console.log('Success Create User');
            })
        }
    })
    
    app.listen(3030)
}).catch(err => { 
    console.log(err);
})