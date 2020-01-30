var router = require('express').Router();

router.get('/',(req,res)=>{
    res.render('indexpage')
});

router.get('/index',(req,res)=>{
    res.render('indexpage')    
});

router.get('/documents',(req,res)=>{
     res.render('documents')
}); 

router.get('/userlogin',(req,res)=>{
    res.render('userlogin')
});

router.get('/dashboarduser',(req,res)=>{
    res.render('dashboarduser')
});
router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
});

router.get('/adminlogin',(req,res)=>{
    res.render('adminlogin')

});

router.get('/adduser',(req,res)=>{
    res.render('adduser')

});

router.get('/adddocument',(req,res)=>{
    res.render('adddocument')

});
  
module.exports=router