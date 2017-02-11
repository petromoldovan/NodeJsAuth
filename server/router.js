const authentication = require('./controllers/authentication')
const data = require('./controllers/data');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session:false});
const requireSignin = passport.authenticate('local', {session: false});


module.exports = function(app) {
    //functions that hold routes are called with 3 params:
    // req(aka request - object on incoming http request),
    // res (response that we send back)
    // next (for error handling)
    app.get('/', function(req, res, next) {
        res.send(['waterbottle', 'phone', 'paper'])
    })
    .get("/users", function(req, res, next){
      res.send(['paper'])
    })
    .get('/data', data.displayData)
    .post('/signup', authentication.signup)
    .get('/test', requireAuth, function(req, res,next){
        res.send({res: 'hi'})
    })
    .post('/signin', requireSignin, authentication.signin)
}