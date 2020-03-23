const mongodb = require('mongodb')
const getDb = require('../helpers/database').getDb

class Product {
    constructor(id, title, description, price, image, userId){
        this._id = id ? new mongodb.ObjectId(id) : null
        this.title = title
        this.description = description
        this.price = price
        this.image = image
        this.userId = userId
    }

    save() {
        let operation
        if(this._id){
            operation = getDb().collection('products').updateOne(
                {_id: this._id},
                {$set: this}
            )
        }else{
            operation = getDb().collection('products').insertOne(this)
        }

        return operation
        .then(result => {
            return result
        })
        .catch(err => {
            throw err
        })
    }

    static fetchAll() {
        return getDb().collection('products').find()
        .toArray()
        .then(products => {
            return products
        })
        .catch(err => {
            console.log(err);
        })
    }

    static getById(id) {
        return getDb().collection('products').find({
            _id: new mongodb.ObjectId(id)
        })
        .next()
        .then(product => {
            return product
        })
        .catch(err => {
            console.log(err);
        })
    }

    static deleteById(id) {
        return getDb().collection('products')
        .deleteOne({ _id: new mongodb.ObjectID(id) })
        .then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err)
        })
    }
}

module.exports = Product