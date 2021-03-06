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

    /* ---------------------------------- CART ---------------------------------- */

    addCart(productId) {
        const cartProductIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() == productId.toString()
        })
        
        let newQuantity = 1
        const updatedCart = [...this.cart.items]

        if(cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1
            updatedCart[cartProductIndex].quantity = newQuantity 
        }else{
            updatedCart.push({
                productId: productId,
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

    getCart() {
        const productsId = this.cart.items.map(item =>{
            return new mongodb.ObjectId(item.productId)
        })

        return getDb().collection('products').find({_id: {
            $in: productsId
        }})
        .toArray()
        .then(products => {
            return products.map(product => {
                return {
                    ...product,
                    quantity: this.cart.items.find(item => {
                        return product._id.toString() == item.productId.toString()
                    }).quantity
                }
            })
        })
    }

    deleteCart(productId) {
        const updatedCart = this.cart.items.filter(item => {
            return item.productId.toString() != productId.toString()
        })
        
        return getDb().collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            {$set: {
                cart: {items: updatedCart}
            }}
        )
    }

    /* ---------------------------------- ORDER --------------------------------- */
    addOrder() {
        return getDb().collection('orders')
        .insertOne({
            ...this.cart,
            userId: new mongodb.ObjectId(this._id)
        })
        .then(result => {
            this.cart = {items: []}
            return getDb().collection('users').updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {
                    cart: {items: [] }
                }}
            )
        })
    }

    getOrder() {
        return getDb().collection('orders')
        .find({ userId : this._id })
        .toArray()
        .then(async result => {
            
            const allOrder = []
            const orders = async() => {
                for (const order of result){
                    const orderProductId = await order.items.map(i => {
                        return new mongodb.ObjectId(i.productId)
                    })

                    const products = await getDb().collection('products').
                    find({_id: {$in: orderProductId}})
                    .toArray()
                    .then(product => {
                        return product
                    })

                    await allOrder.push({
                        id: order._id.toString(),
                        products
                    })
                }
            }

            return orders().then(() => {
                return allOrder
            })
            
        })
        
    }

    getOrder() {
        return getDb().collection('orders')
        .find({ userId : this._id })
        .toArray()
        .then(async result => {
            
            const allOrder = []
            const orders = async() => {
                for (const order of result){
                    const orderProductId = await order.items.map(i => {
                        return new mongodb.ObjectId(i.productId)
                    })

                    const products = await getDb().collection('products').
                    find({_id: {$in: orderProductId}})
                    .toArray()
                    .then(product => {
                        return product
                    })

                    await allOrder.push({
                        id: order._id.toString(),
                        products
                    })
                }
            }

            return orders().then(() => {
                return allOrder
            })
            
        })
        
    }
}

module.exports = User