const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const Document = require('../model/Document');
const {registerValidation, loginValidation} = require("../validation");

router.post('/register',async (req,res)=>{
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
        master:req.body.master,
        password:hashPassword
    })
    try{
        const savedUser = await user.save();
        res.send(`${savedUser.username} is created`);
    }catch(err){
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login',async (req,res)=>{
    const {error} = loginValidation(req.body);
    if(error) return res.render('indexpage',{msg:error.details[0].message})
    // res.status(400).send(error.details[0].message);

    // Checking if email exists
    const user = await User.findOne({username:req.body.username});
    const users = await User.find();

    if(!user) return res.render('indexpage',{msg:'Invalid Username or password'});

    // Checking Password is Correct 
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return  res.render('indexpage',{msg:'Invalid password'});
    
    // create and assign token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    if(user.master){
        res.header('auth-token',token).render('dashboarduser',{users});
    }else{
        const documents = await Document.find({ userAttached: { "$in" : [user.username]} });
        res.header('auth-token',token).render('documents',{documents});
    }
})

module.exports = router;