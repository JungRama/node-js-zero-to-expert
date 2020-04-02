const mongoose = require('mongoose')

const Scheme = mongoose.Schema

const orderScheme = new Scheme({
    items: [{
        productId: {
            type: Scheme.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    userId: {
        type: Scheme.Types.ObjectId,
        required: true,
        ref: 'User',
    }
})

module.exports = mongoose.model('Order', orderScheme)