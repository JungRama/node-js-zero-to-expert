const Order = require('../models/order')

const fileSystem = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')

exports.addOrder = ( req, res, next ) => {
    const order = new Order({
        items: req.user.cart.items,
        userId: req.user._id
    })
    
    order.save()
    .then(result => {
        req.user.cart.items = []
        req.user.save()
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getOrder = (req, res, next) => {
    Order.find()
    .populate('items.productId')
    .where('userId').equals(req.user._id)
    .then(orders => {
        res.render('frontend/order', {
            rName: 'frontOrder',
            orders: orders,
            title: 'Order',
        })
    })
}

exports.getInvoice = (req, res, next) => {
    const id = req.params.id
    const invoiceName = 'invoice-'+id+'.pdf'
    const invoicePath = path.join('data', 'invoices', invoiceName)
    
    Order.findById(id)
    .populate('items.productId')
    .then(order => {
        if(!order){
            return next(new Error('No order found'))
        }
        if(order.userId.toString() != req.user._id.toString()) {
            return next(new Error('Unauthorized'))
        }

        const document = new PDFDocument()
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader(
            'Content-Disposition', 
            'inline; filename="' + invoiceName +'"'
        )
        document.pipe(fileSystem.createWriteStream(invoicePath))
        document.pipe(res)
        document.text("Invoice")
        document.text("---------------------")
        order.items.forEach(item => {
            document.text(`${item.productId.title} -- qty : ${item.quantity} -- price : ${item.productId.price}`)
        })
        document.end()

    }).catch(err => {
        console.log(err);
    })
}