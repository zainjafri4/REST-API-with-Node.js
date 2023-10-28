const mongoose = require('mongoose');
// const Product = require('./products');

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : {type : mongoose.Schema.Types.ObjectId, ref: 'Product', require:true},
    quantity: {type : Number, default: 1}

})

module.exports = mongoose.model("Order", orderSchema);