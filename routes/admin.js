const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const bcrypt = require ('bcryptjs');
const Document = require('../model/Document');
const {documentValidation,registerValidation} = require("../validation");



router.get('/',verify,async(req,res)=>{
    const admin = await User.findOne({_id:req.user._id});
    if(admin.master){
        const users = await User.find();
        return res.send(users);
    }else{
        return res.status(400).send("Access Denied");
    }
});

router.post('/',async (req,res)=>{

     // Validating Data before saving 
     const {error} = registerValidation(req.body)
     if(error) return res.status(400).send(error.details[0].message);
     
     // Checking if the username in database
     const usernameExist = await User.findOne({username:req.body.username});
     if(usernameExist) return res.status(400).send('Username already Exists');
 
     // HASH THE PASSWORD
     const salt = await bcrypt.genSalt(10);
     const hashPassword = await bcrypt.hash(req.body.password, salt);
 
     //Create a New User
     const user = new User({
         name:req.body.name,
         username:req.body.username,
         master:false,
         password:hashPassword
     })
     try{
         const savedUser = await user.save();
         res.redirect('/dashboarduser');
     }catch(err){
         res.status(400).send(err);
     }

})

// User Delete

router.delete('/:username',verify,async(req,res)=>{
    const admin = await User.findOne({_id:req.user._id});
    if(admin.master){
        const username = await User.findOne({username:req.params.username});
        // return  res.send(username)
        if(!username) return res.status(400).send(`${req.query} username does not exist`);

        const deleteusername = await User.findOneAndRemove({username:req.params.username})
        
        return res.send("User Deleted");
        
    }else{
        return res.status(400).send("Access Denied");
    }
});


// Document List

router.get('/document',verify,async(req,res)=>{
    const admin = await User.findOne({_id:req.user._id});
    if(admin.master){
        const document = await Document.find();
        return res.send(document);
    }else{
        return res.status(400).send("Access Denied");
    }
});


// Document Adding
router.post('/document',verify,async(req,res)=>{
    const admin = await User.findOne({_id:req.user._id});
    if(admin.master){
        const {error} = documentValidation(req.body)
        if(error) return res.status(400).send(error);

        const filename = await Document.findOne({filename:req.body.filename});
        if(filename) return res.status(400).send('filename already exist');

        const document = new Document({
            filename:req.body.filename,
            source:req.body.filename,
            date:Date.now(),
            userAttached:req.body.userAttached
        })
        try{
            const savedDocument = await document.save();
            res.redirect('/dashboard');
        }catch(err){
            res.status(400).send(err);
        }
    }else{
        return res.status(400).send("Access Denied");
    }
});

// Document Find One
router.get('/document/:filename',verify,async(req,res)=>{
    const admin = await User.findOne({_id:req.user._id});
    if(admin.master){
        const filename = await Document.findOne({filename:req.params.filename});
        if(!filename) return res.status(400).send(`${req.query} filename does not exist`);
        return res.send(filename);
    }else{
        return res.status(400).send("Access Denied");
    }    
});

// Document Update One
router.put('/document/:filename',verify,async(req,res)=>{
    const admin = await User.findOne({_id:req.user._id});
    if(admin.master){
        const filename = await Document.findOne({filename:req.params.filename});
        if(!filename) return res.status(400).send(`${req.query} filename does not exist`);

        const newfilename = await Document.findOneAndUpdate({filename:req.params.filename},{
            filename:req.body.filename,
            source:req.body.filename,
            date:Date.now(),
            userAttached:req.body.userAttached
        })
        return res.send("document updated successfully");
    }else{
        return res.status(400).send("Access Denied");
    }
});

// Document Delete One
router.delete('/document/:filename',verify,async(req,res)=>{
    const admin = await User.findOne({_id:req.user._id});
    if(admin.master){
        const filename = await Document.findOne({filename:req.params.filename});
        if(!filename) return res.status(400).send(`${req.query} filename does not exist`);

        const deletefilename = await Document.findOneAndRemove({filename:req.params.filename});
        return res.send("Document Deleted");
    }else{
        return res.status(400).send("Access Denied");
    }
});


module.exports = router;

