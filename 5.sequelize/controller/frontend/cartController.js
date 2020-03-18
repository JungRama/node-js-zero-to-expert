const Cart = require('../../models/cart')
const Product = require('../../models/product')

exports.getCart = ( req, res, next ) => {
    req.user.getCart()
    .then(cart => {
        return cart.getProducts()
        
    })
    .then(products => {
        res.render('frontend/cart', {
            rName: 'frontCart',
            title: 'Cart',
            cartData : products
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.addCart = ( req, res, next ) => {
    const productID = req.body.id
    let cartRequest
    let newQuantity = 1

    req.user.getCart()
    .then(cart => {
        cartRequest = cart
        return cart.getProducts({ where: { id: productID } })
    })
    .then(products => {
        let product 

        if (products.length > 0){
            product = products[0] 
        }
        if(product) {
            const oldQuantity = product.cart_item.quantity
            newQuantity = oldQuantity + 1
            return product
        }
        return Product.findByPk(productID)
    })
    .then(product =>{
        return cartRequest.addProduct(product, {
            through: { quantity: newQuantity }
        })
    })
    .then(() => {
        res.redirect('/')
    })
    
    .catch(err => console.log(err))
}

exports.deleteCart = ( req, res, next ) => {
    const productID = req.body.id
    req.user.getCart()
    .then(cart =>{
        return cart.getProducts({ where: { id: productID } })
    })
    .then(products => {
        const product = products[0]
        return product.cart_item.destroy()
    })
    .then(result => {
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
}