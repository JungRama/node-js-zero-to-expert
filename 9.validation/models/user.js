const mongoose = require('mongoose')

const Scheme = mongoose.Schema

const userScheme = new Scheme({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                ref: 'Product',
                type: Scheme.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

userScheme.methods.addToCart = function (productId) {
    const cartProductIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() == productId.toString()
    })

    let newQuantity = 1
    const updatedCart = [...this.cart.items]

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCart[cartProductIndex].quantity = newQuantity
    } else {
        updatedCart.push({
            productId: productId,
            quantity: 1
        })
    }

    this.cart.items = updatedCart

    return this.save()
}

userScheme.methods.deleteCart = function (productId) {
    const updatedCart = this.cart.items.filter(item => {
        return item._id.toString() != productId.toString()
    })

    this.cart.items = updatedCart
    
    return this.save()
}

module.exports = mongoose.model('User', userScheme)