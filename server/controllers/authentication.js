const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config')


//function to create token for a user. UserID and timestamp are encrypted
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({error: "You must provide email and password"})
    }

    //see if user with given email exists
    //User here is class of ALL users
    User.findOne({email: email}, function(err, existingUser){
        if(err) {return next(err);}

        console.log(existingUser)

        //if user exists return error
        if(existingUser) {
          return res.status(422).send({error: 'Email is in use'});
        }

        //if user with email does not exist create user record
        const user = new User({
            email: email,
            password: password
        });

        //save the newly created user
        user.save(function(err) {
            if (err) {return next(err);}
        });


        //respond to request indicating that user was created
        res.send({token: tokenForUser(user)})
    });
};


exports.signin = function(req, res, next) {
    //here user has already had their email and password so we just need to give the token
    res.send({token: tokenForUser(req.user)})
};
