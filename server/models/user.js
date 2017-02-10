const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//define model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

//On save Hook, encrypt password.
//this is all password encryption stuff.
// Before saving model we run this function. The "pre" save does the trick
userSchema.pre('save', function(next) {
    //get access to user model
    const user = this;

    //generate a salt then run callback(because it takes some time to generate salt)
    bcrypt.genSalt(10, function(err, salt){
        if(err) {return next(err);}

        //hash(encrypt) password using salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) {return next(err)}

            //overwrite plain text password with encrypted password "hash"
            user.password = hash;

            //proceed to save the model
            next();
        })
    })
});


//create the model class. We use to create new users
const ModelClass = mongoose.model('user', userSchema);

//export the model
module.exports = ModelClass;
