const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Import Routes
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const studentRoute = require('./routes/student');

dotenv.config();

// Connect To DB
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:true},()=>{
    console.log('Connected to highcourt DB');
});

app.use(express.json());

// Route Middlewares
app.use('/api/user',authRoute);
app.use('/api/admin',adminRoute);
app.use('/api/student',studentRoute);


app.listen(4000, ()=>{
    console.log("Server is listening on 2000");
})
