const fs = require('fs')
const path = require('path')

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
    constructor(image, title, price) {
        this.image = image
        this.title = title
        this.price = price
    }

    save() {
        this.id = Math.floor(Math.random() * Math.floor(999999));
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), err => {
                console.log(err);
            });
        });
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