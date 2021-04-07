const express=require('express');
const routes=require('./routes/api');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');

const app=express();
//middleware:code which runs between request and response 
//initialise the routes

//connect to mongodb
mongoose.connect('mongodb://localhost/ninjago');
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use('/api',routes);

app.use((err,req,res,next)=>{
    res.status(422).send({error:err.message});
})

app.listen(3000,(res,req)=>{
    console.log("hey folks");
})