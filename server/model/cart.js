const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  cartItems: [
      {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Productdb', required: true },
          quantity: { type: Number, default: 1 },
          //price: { type: Number, required: true }
      }
  ]
})

const Cartdb = mongoose.model('cartdb', cartSchema);

module.exports = Cartdb;
