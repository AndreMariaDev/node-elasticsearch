const express = require('express');
const app = express();
var cors = require('cors');
const cookiePrase = require('cookie-parse');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-safe');
dotenv.load();
app,use(cors());
//app.use(cookiePrase);
app.use(express.json());
app.use(express.urlencoded({extended : true}));

const routesPokemon = require('./app/routes/routes-pokemon');
const routesLogin = require('./app/routes/routes-login');

//let token = jwt.sign({id},process.env.SECRET,{expiresIn:300});
//jwt.verify(token,process.env.example.SECRET,(error,decoded)=>{ res.userId = decoded.id});

app.listen(3000,(req,res)=>{
    app.locals.jwt = jwt;
    console.log('Server is running on PORT:',3000);
    routesLogin(app);
    routesPokemon(app);
})