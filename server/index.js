//1. Tools
    const express = require('express');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    //http library is native node library that works on low level with http request
    const http = require('http');
    const cors = require('cors');
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

    //to allow cross origin requests(different domains, subdomains, ports) use the cors middleware on server side.
    // cors is the security protocol to protect user in browser. Used to prevent unwanted ajax requests from one domain to another.
    // By default server checks if domain is the same as its own. If not it gives cors error(Not allowed cross origin...)
    //By using this middleware we force server to respond to any requests from any domains.
    app.use(cors());

    //every request that is INCOMING will be parsed as json
    app.use(bodyParser.json({type: '*/*'}));


    app.use('/static', express.static('public'));

    //initialize router for app
    router(app);


//3. Server sut up
    const port = process.env.PORT || 9000;

    //here we say to forward all http requests to express server
    const server = http.createServer(app);
    server.listen(port);
    console.log('Server listening on:', port);