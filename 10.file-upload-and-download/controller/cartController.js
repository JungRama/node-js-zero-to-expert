exports.getCart = ( req, res, next ) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(products => {
        res.render('frontend/cart', {
            rName: 'frontCart',
            title: 'Cart',
            cartData : products.cart.items
        })
    })
}

exports.addCart = ( req, res, next ) => {
    const productId = req.body.productId
     req.user.addToCart(productId)
    .then(result => {
        res.redirect('/')
    })
}

exports.cartController = ( req, res, next ) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(async products => {
        let totalPrice = 0
        
        await products.cart.items.forEach(item => {
            totalPrice += item.quantity * item.productId.price
        });

        res.render('frontend/checkout', {
            rName: 'frontCart',
            title: 'Cart',
            cartData : products.cart.items,
            totalPrice
        })
    })
}

exports.deleteCart = ( req, res, next ) => {
    req.user.deleteCart(req.body.id)
    .then(result => {
        res.redirect('/cart')
    })
}