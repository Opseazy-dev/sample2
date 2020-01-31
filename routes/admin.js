const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const bcrypt = require ('bcryptjs');
const Document = require('../model/Document');
const multer = require('multer');
var path = require('path');
const {registerValidation, documentValidation} = require("../validation");

//Set Storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename:function(req,file,cb){
        cb(null,req.body.filename+path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage,
    limits:{fileSize:1150000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);
    }

}).single('fname');

function checkFileType(file,cb){
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true) ;
    }else{
        cb('Error : PDF Only')
    }
}
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
router.post('/document',async(req,res)=>{
            upload(req,res,async(err)=>{
                if(err){
                    res.render('adddocument',{
                        msg:err
                    })
                }else{
                    const {error} = documentValidation(req.body)
                    if(error) return res.render('adddocument',{msg: error.details[0].message });
                    const filename = await Document.findOne({filename:req.body.filename});
                    if(filename) return  res.render('adddocument',{msg: 'Document Name already exist' })

                    const document = new Document({
                        filename:req.body.filename,
                        source:'/uploads/'+req.file.filename,
                        date:Date.now(),
                        userAttached:req.body.userAttached
                    })
                    try{
                        const savedDocument = await document.save();
                        res.render('dashboard')
                    }catch(err){
                        res.render('adddocument',{msg: 'Something Went Wrong' })
                    }
            }
        })
        
    // }else{
    //     return res.status(400).send("Access Denied");
    // }
});



module.exports = router;

