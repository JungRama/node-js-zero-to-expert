const Order = require('../models/order')

exports.addOrder = ( req, res, next ) => {
    const order = new Order({
        items: req.user.cart.items,
        userId: req.user._id
    })
    
    order.save()
    .then(result => {
        req.user.cart.items = []
        req.user.save()
        res.redirect('/cart')
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getOrder = (req, res, next) => {
    Order.find()
    .populate('items.productId')
    .where('userId').equals(req.user._id)
    .then(orders => {
        console.log({o : orders});
        
        res.render('frontend/order', {
            rName: 'frontOrder',
            orders: orders,
            title: 'Order',
        })
    })
}

