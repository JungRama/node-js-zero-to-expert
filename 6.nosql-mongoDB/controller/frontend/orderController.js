const Product = require('../../models/product')

exports.addOrder = ( req, res, next ) => {
    let cartRequest

    req.user.getCart()
    .then(cart => {
        cartRequest = cart
        return cart.getProducts()
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            order.addProducts(products.map(product => {
                product.order_item = {
                    quantity: product.cart_item.quantity
                }
                return product
            }))
        })
    })
    .then(() => {
        return cartRequest.setProducts(null)
    })
    .then(() => {
        res.redirect('/cart')
    })
}

exports.getOrder = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
    .then(orders => {
        res.render('frontend/order', {
            rName: 'frontOrder',
            orders: orders,
            title: 'Order',
        })
    })
}

