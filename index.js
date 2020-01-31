const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var hbs =require('express-handlebars');
var path = require('path');
  

const hbsHelpers = require('./helpers/handlebars');
// Import Routes
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const studentRoute = require('./routes/student');
const defaultRoute = require('./routes/default');

dotenv.config();

// Connect To DB
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:true},()=>{
    console.log('Connected to highcourt DB');
});
   
app.use(express.json());  
app.use(express.urlencoded({ extended:false}));

  
app.set('view engine','hbs');
app.engine ('hbs',hbs({
    extname:'hbs',
    defaultview:'default',
    layoutDir:__dirname +'/views/layouts/',
    helpers: hbsHelpers
}));

app.use(express.static(path.join(__dirname,"/public")));

    

// Route Middlewares    
app.use('/api/user',authRoute);  
app.use('/api/admin',adminRoute);
app.use('/api/student',studentRoute);
app.use('/',defaultRoute);


app.listen(2500, ()=>{
    console.log("Server is listening on 2500");
})
