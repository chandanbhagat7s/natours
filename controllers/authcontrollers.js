// creating for authication purpose 

//bring apperror
const appError = require('./../util/appError')


// requring model
const User = require('./../models/User');
// for handlaing error 
const runAsync = require('./../util/runAsync')
//for token : autenication token to access protected data from the route , as user do not provid his usname and pass.. and we do not want that server will remenber the state so , by token it will be matched okk and provide acess 
const jwt = require('jsonwebtoken')


// function for creating the token 
const createToken = function (id) {
    return jwt.sign({ id }, process.env.SECRET);
}





// creating for signup 
exports.signup = runAsync(async (req, res, next) => {

    // const newUser = await User.create(req.body)  // creas as like : becoz this data will go to DB
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        photo: req.body.photo || '',

    })
    const token = createToken(newUser._id)


    res.status(200).json({
        status: 'success',
        token: token,
        user: { newUser }
    })
});


// now for login 

exports.login = runAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //verifying weather email and password is provided
    if (!email || !password) {
        return appError('please enter email and password', 404)
    }
    // bringign out the user(all data) with password for comparison 
    const userpass = await User.findOne({ email }).select('+password')
    //commented so if failed to know the email then this fun.. will create problem..
    // const cmpred = await User.correctPass(password, userpass) 


    if (!userpass || !(await userpass.correctPass(password, userpass.password))) {//401 : unauthorized user
        return appError('please enter correct email or password', 401)
    }


    // sending the token 
    const token = createToken(userpass._id)

    res.status(200).json({
        status: 'success',
        token: token
    })



})


























