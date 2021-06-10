const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const app = express()
console.log(__dirname);

app.use(express.static(__dirname + '/public'));
//===========================CORS support==============================
app.use(function (req, res, next) {

    //req.setEncoding('utf8');
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, user_id, authtoken, Authorization");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.setHeader("Access-Control-Allow-Credentials", true);

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});
//=========================Cors support===============================
app.use(express.json())
app.use(userRouter)

module.exports = app