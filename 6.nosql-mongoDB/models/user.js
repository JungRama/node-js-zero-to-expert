const mongodb = require('mongodb')
const getDb = require('../helpers/database').getDb

class User {
    constructor(id, username, email, cart) {
        this._id = id
        this.username = username
        this.email = email
        this.cart = cart
    }

    save() {
        return getDb().collection('users')
        .insertOne(this)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })
    }
 
    addCart(product) {
        const cartProductIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() == product._id.toString()
        })
        
        let newQuantity = 1
        const updatedCart = [...this.cart.items]

        if(cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1
            updatedCart[cartProductIndex].quantity = newQuantity 
        }else{
            updatedCart.push({
                productId: product._id,
                quantity: 1
            })
        }

        const storeCart = {
            items: updatedCart
        }

        return getDb().collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            {$set: { cart: storeCart }}
        )
    }

    static getById(id) {
        return getDb().collection('users')
        .findOne({ _id: new mongodb.ObjectId(id) })
        .then(user => {
            return user
        })
        .catch(err => {
            console.log(err);
        })
    }
}

module.exports = User