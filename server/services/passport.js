//here we authenticate user when he makes a request
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


//Create local strategy  <--- for existing users that log in
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    //verify this username and password and call done with the user
    //if it is the correct username and password.
    //otherwise, call done with false
    User.findOne({email:email}, function(err, user){
        if(err) {return done(err)}
        if(!user) { return done(null, false)}

        //compare passwords - is 'password' equal to user.password?
        //We need to compare hashed password from db and compare it to hashed provided password by user.
        //When we save password with bcrypt we save it as Salt + hashed password in db.
        // Now we need to
        // 1) hash the incoming password;
        // 2)get password value from db and remove Salt from it -> we will get just hashed password;
        // 3) compare the two hashed passwords. Never compare plain text passwords!
        user.comparePassword(password, function(err, isMatch){
            if (err) {return done(err)}
            //if there it is not a match of passwords then return
            if(!isMatch) {return done(null, false)}

            //if all good then return done with user
            return done(null, user);
        })
    })
});


//setup options for JWT strategy
const jwtOptions = {
    //extract token from header called 'authorization'. We could also extract it from url
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//create JWT strategy  <--- for new users that register
                                        //payload here is decoded token
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
   //See if user id in payload exists in our db.
    //if it does, call 'done' with that user obj
    //otherwise, call 'done' without use obj
    User.findById(payload.sub, function(err, user) {
                                    //false = there is no user
        if(err) {return done(err, false)};

        if(user) {
            //function 'done' is callback of passport
            done(null, user);
        } else {
            done(null, false)
        }

    })
});


//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
