const Sequelize = require('sequelize')
const db = require('../helpers/database')

const CartItem = db.define('cart_item', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
})

module.exports = CartItem