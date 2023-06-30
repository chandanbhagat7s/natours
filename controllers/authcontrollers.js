// creating for authication purpose 

// requring model
const User = require('./../models/User');
// for handlaing error 
const runAsync = require('./../util/runAsync')


// creating for signup 
exports.signup = runAsync(async (req, res, next) => {
    const newUser = await User.create(req.body)

    res.status(200).json({
        status: 'success',
        user: { newUser }
    })
});



























