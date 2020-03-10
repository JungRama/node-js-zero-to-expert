const fs = require('fs')
const path = require('path')
const Cart = require('./cart')

const filePath = path.join(
    path.dirname(process.mainModule.filename), 
    'storage', 
    'product.json'
)

const getProductsFromFile = callback => {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        callback([]);
      } else {
        callback(JSON.parse(fileContent));
      }
    });
  };
  

module.exports = class Product {
    constructor(id, image, title, price) {
        this.id = id
        this.image = image
        this.title = title
        this.price = price
    }

    save() {
        getProductsFromFile(products => {
            if(this.id){
                const getIndexProduct = products.findIndex(product => product.id == this.id)
                const updatedProduct = [...products]
                console.log(getIndexProduct);
                
                updatedProduct[getIndexProduct] = this

                products.push(this);
                fs.writeFile(filePath, JSON.stringify(updatedProduct), err => {
                    console.log(err);
                });
            }else{
                this.id = Math.floor(Math.random() * Math.floor(999999));
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
            
        });
    }

    static delete(id) {
        getProductsFromFile(products => {
            const getProduct = products.find(product => product.id == id)
            const updatedProduct = products.filter(product => product.id != id)

            fs.writeFile(filePath, JSON.stringify(updatedProduct), err => {
                if(!err){
                    Cart.delete(id, getProduct.price)
                }
            });
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findByID(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(item => id == item.id)
            callback(product)
        })
    }
}   