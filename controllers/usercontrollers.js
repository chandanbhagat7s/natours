


const runAsync = require('./../util/runAsync')
const User = require('./../models/User');
const appError = require('../util/appError');

const factory = require('./factory');
const { Model } = require('mongoose');


exports.getMe = (req, res, next) => {
    console.log(req.user);
    req.params.id = req.user._id;

    next()
}





const updatonly = (totalOBJ, ...rest) => {
    const newObj = {}
    Object.keys(totalOBJ).forEach(e => {
        if (rest.includes(e)) {
            newObj[e] = totalOBJ[e]
        }
    })
    console.log(newObj);
    return newObj;
}



exports.getUser = runAsync(async (req, res, next) => {

    const alluser = await User.find();

    res.status(200).json({
        status: "success",
        data: {
            tour: alluser
        }

    })
})


// we are going to create the route to update ther users personal details except the password 
exports.updateMyself = runAsync(async (req, res, next) => { //work with token
    // in req.user user is present 
    // in the body of request password must not be present 
    if (req.body.password || req.body.Cnfpassword) {
        return next(new appError('updatetion of password is  not allowed ', 400));
    }

    // we can simply use find by id and update as we are not handling imp data 
    // but we need to run the validaters for the updated content

    // we do not want to update many fields only the field are provide to be updated 
    const x = updatonly(req.body, 'name', 'email')


    const user = await User.findByIdAndUpdate(req.user.id, x, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        status: 'success',
        data: user
    })
})

exports.deleteMyself = runAsync(async (req, res, next) => {
    // we will not acctually delete the property we will just set the property active to false 
    // geting the user form the token 
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    })

})




exports.createUser = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}


exports.getUserById = factory.getOne(User)
exports.updateUserById = factory.updateOne(User)
exports.deleteUserById = factory.deleteOne(User);