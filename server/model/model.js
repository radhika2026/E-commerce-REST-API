const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    name : {
        type: String
    },
    email : {
       type : String
    }
})

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;
