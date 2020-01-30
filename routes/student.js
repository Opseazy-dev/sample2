const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const bcrypt = require ('bcryptjs');
const Document = require('../model/Document');
const {documentValidation,registerValidation} = require("../validation");

router.get('/',verify,async(req,res)=>{
    const user = await User.findOne({_id:req.user._id});
    if(!user.master){
        const documents = await Document.find({ userAttached: { "$in" : [user.username]} });
        return res.send(documents);
    }else{
        return res.status(400).send("Access Denied");
    }
});

module.exports = router;

