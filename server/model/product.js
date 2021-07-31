const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({

    name : {
        type: String
    },
    price : {
       type: Number
    },
    description : {
      type : String
    }
})

const Productdb = mongoose.model('productdb', productSchema);

module.exports = Productdb;
