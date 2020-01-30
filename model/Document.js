const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
   source:{
        type:String,
        requires:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    userAttached:{
        type:Array
    }
});

module.exports = mongoose.model('Document',documentSchema);

