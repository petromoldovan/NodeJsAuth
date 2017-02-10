const authentication = require('./controllers/authentication')
const data = require('./controllers/data');

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
    .post('/signup', authentication.signup);
}