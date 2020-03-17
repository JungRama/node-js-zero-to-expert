const fs = require('fs');
const path = require('path');

const filePath = path.join(
    path.dirname(process.mainModule.filename), 
    'storage', 
    'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
      fs.readFile(filePath, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 }
        console.log(fileContent);
        
        if(!err){
            cart = JSON.parse(fileContent) // GET CART DATA
        }

        // GET INDEX CART
        const existingProductIndex = cart.products.findIndex(
            product => product.id == id
        )
        // GET PRODUCT IN CART
        const existingProduct = cart.products[existingProductIndex]

        let updateCart
        if (existingProduct) {
            updateCart = { ...existingProduct }
            updateCart.qty = updateCart.qty + 1
            cart.products = [...cart.products]
            cart.products[existingProductIndex] = updateCart
        } else {
            updateCart = { id: id, qty: 1 }
            cart.products = [...cart.products, updateCart]
        }

        cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productPrice)

        fs.writeFile(filePath, JSON.stringify(cart), err => {
            if(err){
                return
            }
        })
      })
  }

  static getAllCart(callback){
    fs.readFile(filePath, (err, fileContent) => {
        callback(JSON.parse(fileContent))
    });
  }

  static delete(id, price) {
      fs.readFile(filePath, (err, fileContent) => {
          if(err) {
              return
          }
          const updateCart = { ...JSON.parse(fileContent) }
          const product = updateCart.products.find(product => product.id == id)
          const productQty = product.qty

          updateCart.products = updateCart.products.filter(
              product => product.id != id
          )

          updateCart.totalPrice = updateCart.totalPrice - price * productQty

          fs.writeFile(filePath, JSON.stringify(updateCart), err => {
             console.log(err);
          })
      })
  }
};
  