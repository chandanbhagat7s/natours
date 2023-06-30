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
        required: [true, 'Please confurm your password'],
        minlength: 8
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

const User = mongoose.model('User', userSchema)

module.exports = User;



