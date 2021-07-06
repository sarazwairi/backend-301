'use strict';

const express = require('express') // require the express package
const app = express() // initialize your express app instance
const cors = require('cors');

app.use(cors()) // after you initialize your express app instance
require('dotenv').config();
const axios = require('axios'); // require the package

const PORT = process.env.PORT;
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/drinks', { useNewUrlParser: true, useUnifiedTopology: true });

const cocktailSchema = new mongoose.Schema({
    name: String,
    img: String,
});

const cocktailModel = mongoose.model('drinks', cocktailSchema);

app.get('/all',allDataHandler);
app.post('/addToFav',addToFavHandler);
app.get('/getFav',getFavDataHandler);
app.delete('/deleteFav',deleteFavHandler);
app.put('/updateFav',updateFavHandler);

function allDataHandler(req,res){
    const url=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`
    axios.get(url)
    .then(result=>{
        res.send(result.data.drinks);
    })
}

function addToFavHandler(req,res){
  const {name,img}=req.body;
  const item=new cocktailModel({
      name:strDrink,
      img:strDrinkThumb,
  })
  item.save(); 
}

function getFavDataHandler(req,res){
    cocktailModel.find({},(err,data)=>{
        res.send(data);
    })
}

function deleteFavHandler(req,res){
    const id= req.query.id;
    cocktailModel.deleteOne({idDrink:id},(err,data)=>{
        cocktailModel.find({},(err,data)=>{
            res.send(data);
        })
    })
}

function updateFavHandler(req,res){
    const {name,img,id}=req.body;
    cocktailModel.find({idDrink:id},(err,data)=>{
        data[0].strDrink=name;
        data[0].strDrinkThumb=img;
        data[0].save()
        .then(()=>{
            cocktailModel.find({},(err,data)=>{
                res.send(data);
            })
        })
    })
}

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })