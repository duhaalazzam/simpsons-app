'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');
const { urlencoded } = require('express');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware

// Utilize ExpressJS functionality to parse the body of the request
app.use(urlencoded({extended:true}));

// Specify a directory for static resources
app.use('./public/');
// define our method-override reference
app.use(methodOverride('_method'));

// Set the view engine for server-side templating
app.set('view engine','ejs');

// Use app cors


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
app.get('/',indexHandler);
app.get('/favorite-quotes',favHandler);
app.post('/favorite-quotes',saveHandler);
app.put(('/favorite-quotes:quote_id',editHandler));
app.delete(('/favorite-quotes:quote_id',deleteHandler));

// -- WRITE YOUR ROUTES HERE --


// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function indexHandler(req,res){
 let url='https://thesimpsonsquoteapi.glitch.me/quotes?count=10';
 superagent.get(url).set('User-Agent', '1.0').then(data=>
     res.render('index',{data:[data.body]})
 )
}
function saveHandler(req,res){
    let quote=req.body.quote;
    let char=req.body.character;
    let img=req.body.image;
    let charDir=req.body.characterDirection;
    let valArr=[quote,char,img,charDir];
    let sql="INSERT INTO myTable(quote,characterName,img,charDir) VALUES($1,$2,$3,$4)";
    client.query(sql,valArr).then(
        res.redirect('details:quote_id',{data:valArr})
    );

}
function favHandler(req,res){
let sql="SELECT * FROM myTable";
client.query(sql).then(x=>{
    res.render('index',{data: x});
}

)
}
function editHandler(req,res){
    let quote=req.body.quote;
    let char=req.body.character;
    let img=req.body.image;
    let charDir=req.body.characterDirection;
    let id=req.body.id;
    let valArr=[quote,char,img,charDir,id]
    let sql=" UPDATE myTable SET quote = $1, characterName = $2,img=$3,charDir=$4 WHERE id=$5;"
    client.query(sql).then(
        res.redirect('details:quote_id',{data:valArr})
    );

}
function deleteHandler(req,res){
    let id=req.body.id;
    let sql="DELETE FROM myTable WHERE id=$1;"
    client.query(sql).then(
        res.redirect('details:quote_id',{data:id})
    );
}

// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
