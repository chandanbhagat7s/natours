const mongoose = require('mongoose');
const validator = require('validator');
// for security of password
const bcrypt = require('bcryptjs');

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
    }
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

const User = mongoose.model('User', userSchema)

module.exports = User;



