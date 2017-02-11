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

    //Salt - encryption key.
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

//this is function to compare passwords of user that attempt to log in.
//We need to:
// 1) hash the incoming password;
// 2)get password value from db and remove Salt from it -> we will get just hashed password;
// 3) compare the two hashed passwords. Never compare plain text passwords!
//bcrypt does it all for us below
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) {return callback(err)};

        callback(null, isMatch);
    })
};


//create the model class. We use to create new users
const ModelClass = mongoose.model('user', userSchema);

//export the model
module.exports = ModelClass;
