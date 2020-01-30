const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        requires:true,
    },
    master:{
        type:Boolean,
        requires:true,
    },
    password:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('User',userSchema)

