const mongoose = require('mongoose');
const validator = require('validator');
// for security of password
const bcrypt = require('bcryptjs');
// for creating token (reset)
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provid your email'],
        lowercase: true,
        unique: true,
        // we will use validator package
        validate: [validator.isEmail, 'enter valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 8,
        // to hide password to be not selected 
        select: false
    },
    Cnfpassword: {
        type: String,
        require: true,
        minlength: 8,
        // for checking password=cnfpass
        validate: {
            validator: function (cnfPassData) {
                return cnfPassData === this.password
            },
            message: 'please check your password again!'
        }
    },
    changedPasswodTime: Date,
    role: {
        type: String,
        enum: ['admin', 'user', 'guest', 'guide'],
        default: 'user'
    },
    // for changed password
    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date
})

// now we are going to encrypt the password 
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next() // return when user do not change password 

    this.password = await bcrypt.hash(this.password, 12)
    // and making confirm pass as undefine
    this.Cnfpassword = undefined;


})

// we will create an instance for checking the inputed password (basicly comparision hashpassword which is in DB with inputed) by using bcript
// this instance will be available with the document okk 
userSchema.methods.correctPass = async function (inputedpass, acctualpassinhash) {
    return await bcrypt.compare(inputedpass, acctualpassinhash)
}

userSchema.methods.changedPasswords = async function (jwttokentime) {
    if (this.changedPasswodTime) {
        const change = parseInt(this.changedPasswodTime.getTime() / 1000, 10)
        // console.log(jwttokentime, this.changedPasswodTime.getTime() / 1000);
        // console.log(jwttokentime, change);
        // console.log(jwttokentime < change);
        return jwttokentime < change
    }


    // if user has not change the password at least once 
    return false;
}

// midfun for modefying creaatedat
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.changedPasswodTime = Date.now() - 1000;
    next()
})



// function to create the token for forgot password route
userSchema.methods.createTokenForResetPassword = function () {

    // we will create token 
    const plaintoken = crypto.randomBytes(32).toString('hex');
    // saving encripted in DB
    this.passwordResetToken = crypto.createHash('sha256').update(plaintoken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
    return plaintoken;



}

const User = mongoose.model('User', userSchema)

module.exports = User;



