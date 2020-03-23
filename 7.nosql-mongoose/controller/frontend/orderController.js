exports.addOrder = ( req, res, next ) => {
    req.user.addOrder()
    .then(() => {
        res.redirect('/cart')
    })
}

exports.getOrder = (req, res, next) => {
    req.user.getOrder()
    .then(orders => {
        // console.log({o : orders});
        
        res.render('frontend/order', {
            rName: 'frontOrder',
            orders: orders,
            title: 'Order',
        })
    })
}

