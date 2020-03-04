const fs = require('fs')
const path = require('path')

const filePath = path.join(
    path.dirname(process.mainModule.filename), 
    'storage', 
    'product.json'
)

module.exports = class Product {
    constructor(title, price) {
        this.title = title
        this.price = price
    }

    save() {
        fs.readFile(filePath, (err, file) => {
            let products = []
            if(!err){
                products = JSON.parse(file) // GET ALL OBJECT IN PRODUCT.JSON
            }
            products.push(this)

            fs.writeFile(filePath, JSON.stringify(products), (err) => {
                console.log(err);
            })
        })
    }

    static fetchAll(callback) {
        fs.readFile(filePath, (err, file) => {
            if(err){
                return callback([])
            }
            callback(JSON.parse(file))
        })
    }
}   