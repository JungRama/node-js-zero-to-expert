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
const sequelize     = require('./helpers/database')
/* --------------------------------- END HELPERS -------------------------------- */

/* ---------------------------------- MODEL --------------------------------- */
const Product       = require('./models/product')
const User          = require('./models/user')
const Cart          = require('./models/cart')
const CartItem      = require('./models/cart-item')
const Order         = require('./models/order')
const OrderItem     = require('./models/order-item')
/* ---------------------------------- END MODEL --------------------------------- */

const app           = express()

/* ----------------------------- MODEL RELATION ----------------------------- */
Product.belongsTo(User, {constaints: true, onDelete: 'CASCADE'})
User.hasMany(Product)

Cart.belongsTo(User)
User.hasOne(Cart)

Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })
/* ----------------------------- END MODEL RELATION ----------------------------- */

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user
        next()
    })
    .catch(err => console.log(err))
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

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(userData => {
        if(!userData){
            return User.create({ 
                name: 'Jung Rama', 
                email: 'jungrama.id@gmail.com' 
            }).then(user => {
                user.createCart()
            })
        }
    })
    .then(() => {
        app.listen(3030)  
    })
    .catch(err => {
        console.log(err)
    })
