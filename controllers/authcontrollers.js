// creating for authication purpose 
const app = require('./../app')
const express = require('express');
//bring apperror
const appError = require('./../util/appError')
const { promisify } = require('util');

const crypto = require('crypto');
// importing email
const sendEmail = require('./../util/email')
const url = require('url');




// requring model
const User = require('./../models/User');
// for handlaing error 
const runAsync = require('./../util/runAsync')
//for token : autenication token to access protected data from the route , as user do not provid his usname and pass.. and we do not want that server will remenber the state so , by token it will be matched okk and provide acess 
const jwt = require('jsonwebtoken')

// function for sending token and response 
const sendTokenResponse = (user, statuscode, res) => {
    const token = createToken(user._id,)
    // we are going to send token in the form of cookies that we can be safe from cross-side scripting attack

    let options = {
        expires: new Date(Date.now() + process.env.EXP_COOKIE * 24 * 60 * 60 * 1000),
        secure: true, // only for https
        httpOnly: true
    }
    // making optins of secure to false 
    if (process.env.NODE_ENV == 'development') {
        options.secure = false

    }


    res.cookie('jwt', token, options)

    // acctually user password is going in the res
    user.password = false;


    res.status(statuscode).json({
        status: 'success',
        token: token, // sending token for auto login if signup
        user: { user }
    })
}




// middleware for getUser : allowing access when it will provid token
exports.getVerified = runAsync(async (req, res, next) => {
    // bringin out the token from the reqst header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    if (!token) {
        return next(new appError('please login to get access', 401))
    }

    // now we got token 
    //varification step: to check weather someone manuplate data and token expiry
    /* The verify() method of JWT is used to verify the signature of a JSON Web Token (JWT). A JWT is a string that is made up of three parts: a header, a payload, and a signature. The header contains information about the JWT, such as the algorithm that was used to sign it. The payload contains the claims, which are the data that is being protected by the JWT. The signature is used to verify that the JWT has not been tampered with.

The verify() method takes three arguments: the JWT token, the secret key or public key that was used to sign the JWT, and an optional options object. The options object can be used to specify additional verification criteria, such as the expiration time of the JWT.

If the signature of the JWT is valid, the verify() method will return the decoded payload of the JWT. If the signature is invalid, the verify() method will throw an error. */

    // jwt.verify(token,process.env.SECRET)          we will convert it into promise 
    const decode = await promisify(jwt.verify)(token, process.env.SECRET)
    console.log(decode);
    // we need to handle error JsonWebTokenError  and tokenexpire error





    // now we need to check user still exists or password is changed then... we should not access the user okk 
    // if user is deleted meantime 
    // const freshUser = await User.findOne({ id: decode.id })
    const freshUser = await User.findById(decode.id)
    if (!freshUser) {
        return next(new appError('the user do  not exist ', 401))
    }




    // now for if the user change the passwor then we shoud not access
    // console.log(await freshUser.changedPasswords(decode.iat));
    if (await freshUser.changedPasswords(decode.iat)) {
        return next(new appError('password is changed need to login again', 401))
    }

    // future use 
    req.user = freshUser

    next()

})


// function for creating the token 
const createToken = function (id) {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: process.env.EXPIRES
    });
}





// creating for signup 
exports.signup = runAsync(async (req, res, next) => {

    // const newUser = await User.create(req.body)  // creas as like : becoz this data will go to DB
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        photo: req.body.photo || '',
        role: req.body.role

    })
    sendTokenResponse(newUser, 201, res)
    // const token = createToken(newUser._id,)


    // res.status(201).json({
    //     status: 'success',
    //     token: token, // sending token for auto login if signup
    //     user: { newUser }
    // })
});




// now for login 

exports.login = runAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //verifying weather email and password is provided
    if (!email || !password) {
        return next(new appError('please enter email and password', 404))
    }

    let options = {
        disableMiddlewares: true, // can be checked in middleware with this.options.disableMiddlewares
    };

    // bringign out the user(all data) with password for comparison 

    let userpass = await User.findOne({ email }).select('+password').setOptions(options)
    //commented so if failed to know the email then this fun.. will create problem..
    // const cmpred = await User.correctPass(password, userpass) 
    console.log(userpass.email);


    if (!userpass || !(await userpass.correctPass(password, userpass.password))) {//401 : unauthorized user
        return next(new appError('please enter correct email or password', 401))

    }
    await userpass.save()
    // console.log(userpass.active);
    // dont try to do it in middleware (my mistake )
    // can be done in methods.. 
    userpass.active = true;
    // console.log(userpass.active);

    // sending token as response because everytime user will not provid uerid or pass.. , user will get access to protected rout by token
    // sending the token 
    sendTokenResponse(userpass, 200, res)

    // const token = createToken(userpass._id)

    // res.status(200).json({
    //     status: 'success',
    //     token: token
    // })



})


exports.getaccess = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
        console.log(req.user);
        console.log(roles.includes(req.user.role));

        if (!roles.includes(req.user.role)) {
            return next(new appError('u do not access', 403))
        }
        next()

    }
}


exports.forgotPassword = runAsync(async (req, res, next) => {
    //user will send email (using post req..)and on that email we need to send token to email and store encriptedin DB 
    //geting out the email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new appError('enter email address !! which u used at the time of login'))
    }

    // gentrating token 
    const token = user.createTokenForResetPassword()
    // console.log(token);

    // as we have added some data to the particular user : we need to save 
    // user.save({ validateBeforeSave: false });
    await user.save();

    // now we will send the token by  mail
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${token}`

    const massage = `forgot your password submit your patch with token and reset it to ${resetURL}, if u did not forgot you password please ignore`



    // in try catch block because : if we fail to send email then we need to revert the changes okk 
    try {
        // now sending email(async)
        await sendEmail({
            email: user.email,
            subject: 'your password reset token valid for 10 min',
            text: massage
        })

        // we do not send url in response just anyone can send and get it in response so we send it to email okkk 

        res.status(200).json({
            status: 'success',
            massage: 'token send to email'
        })
    } catch (error) {
        user.passwordResetToken = undefined,
            user.passwordResetTokenExpiresIn = undefined
        await user.save({ validateBeforeSave: false })

        return next(new appError('their was error in sending the email', 500))
    }



})
exports.resetPassword = runAsync(async (req, res, next) => {
    // a patch request : which will modefy the user password
    // we need to get the token from the req 
    const tokenReal = req.params.token
    if (!tokenReal) {
        return next(new appError('enter token', 400))
    }
    const hashtoken = crypto.createHash('sha256').update(tokenReal).digest('hex')
    // now we want to fetch user on base of token
    const user = await User.findOne({ passwordResetToken: hashtoken, passwordResetTokenExpiresIn: { $gt: Date.now() } })

    if (!user) {
        return next(new appError('enter valid token or your token has expired', 400))
    }

    // now we will save the password 
    user.password = req.body.password;
    user.Cnfpassword = req.body.Cnfpassword
    // we will also updata the password modefiend at 
    // user.changedPasswodTime=Date.now() with middleware
    // now reseting the password token and expires in 
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    // hear we are saving the document and we want that validators should be run okk 


    await user.save()

    // now sending the token for user to be logind
    sendTokenResponse(user, 200, res)

    // const token = createToken(user._id)

    // res.status(200).json({
    //     status: 'success',
    //     token: token
    // })



});

exports.updatePassword = runAsync(async (req, res, next) => {
    // for updating pass.. the user need to be logined
    // we need to get the user base on token we have
    const user = await User.findById(req.user.id).select('+password')
    // console.log(user);

    if (!user || !(await user.correctPass(req.body.oldPassword, user.password))) {
        return next(new appError('login again', 403))
    }
    // now we need to take the passord from the body and update it 




    user.password = req.body.password;
    user.Cnfpassword = req.body.Cnfpassword;

    await user.save();
    sendTokenResponse(user, 200, res)

    // const token = createToken(user._id)

    // res.status(200).json({
    //     status: 'success',
    //     token: token
    // })


})





















