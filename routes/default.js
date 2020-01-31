var router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const bcrypt = require ('bcryptjs');
const Document = require('../model/Document');
var path = require('path');
const {registerValidation, documentValidation} = require("../validation");

router.get('/',(req,res)=>{
    res.render('indexpage')
});

router.get('/documents',(req,res)=>{
     res.render('documents');
}); 

router.get('/userlogin',(req,res)=>{
    res.render('userlogin');
});

router.get('/dashboarduser',async(req,res)=>{ 
        const users = await User.find();
        return res.render('dashboarduser',{users});
});

router.get('/dashboard',async(req,res)=>{
        const documents = await Document.find();
        return res.render('dashboard',{documents});
});

router.get('/adminlogin',(req,res)=>{
    res.render('adminlogin')

});

router.get('/adduser',(req,res)=>{
    res.render('adduser')

});

router.get('/adddocument',async(req,res)=>{
    // const admin = await User.findOne({_id:req.user._id});
    // if(admin.master){
        const users = await User.find();    
        return res.render('adddocument',{users})
    // }else{
    //     return res.status(400).send("Access Denied");
    // }

});
  
module.exports=router