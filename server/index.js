//1. Tools
    const express = require('express');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    //http library is native node library that works on low level with http request
    const http = require('http');

    //declare app to be instance of express
    const app = express();

    //import router
    const router = require('./router');

    //I also installed nodemon to watch changes in server files for change. No need to reload server anymore
    //command is npm run dev

//1.2 setup DB
//create db "auth"
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:auth/auth');


//2. App setup

//both morgan and bodyParser below are middlewares. Every request into server will pass through middlewares
    //morgan is logging incoming request. I use it for debugging
    app.use(morgan('combined'));

    //every request that is INCOMING will be parsed as json
    app.use(bodyParser.json({type: '*/*'}));

    //initialize router for app
    router(app);


//3. Server sut up
    const port = process.env.PORT || 3090;

    //here we say to forward all http requests to express server
    const server = http.createServer(app);
    server.listen(port);
    console.log('Server listening on:', port);