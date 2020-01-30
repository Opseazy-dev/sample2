const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

var hbs =require('express-handlebars');
var path = require('path');
  
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

// app.engine('handlebars',expbs({ defaultLayout:'main'}));
// app.set('view engine','handlebars');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname,"/public/image")));
// app.use(express.static(path.join(__dirname,"/public/style")));
  
app.set('view engine','hbs');

app.engine ('hbs',hbs({
    extname:'hbs',
    defaultview:'default',
    layoutDir:__dirname +'/views/layouts/'
}));

app.use(express.static(path.join(__dirname,"/public/image")));
app.use(express.static(path.join(__dirname,"/public/style")));
    


// Route Middlewares    
app.use('/api/user',authRoute);  
app.use('/api/admin',adminRoute);
app.use('/api/student',studentRoute);
app.use('/',defaultRoute);


app.listen(2500, ()=>{
    console.log("Server is listening on 2500");
})   