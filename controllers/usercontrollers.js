// for storing images in fs
const multer = require('multer');
// for resizing the image
const sharp = require('sharp');


const runAsync = require('./../util/runAsync')
const User = require('./../models/User');
const appError = require('../util/appError');

const factory = require('./factory');
const { Model } = require('mongoose');

// now inorder to resize the image we Need to store file in buffer (memory) then we can perform task 
const multerStorage = multer.memoryStorage()


// for storage purpose whare and what name
// const multerStorage = multer.diskStorage({
//     //destination function to store the files
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users')
//     },
//     // now to deside the file name 
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];  // mimetype: 'image/jpeg',
//         // defineng the name of file 
//         cb(null, `user-${req.user._id}-${Date.now()}.${ext}`)

//     }
// })


// now filteration by ony for image as file type 
const mfilter = (req, file, cb) => {
    console.log("entred");
    // if it is image then null with true 
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        // if not error with false
        cb(new appError('the file expected hear of image type  ', 400), false)

    }
}

// for resizing we will create  a middleware 
exports.resizeImage = runAsync(async (req, res, next) => {
    if (!req.file) return next()

    // now defining the file name
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`
    // we Need sharp package and then chain some method Like : resize , format , quality , 
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`)

    next()
})

// now destination : such that file is stored on disk 
// const uplode = multer({ dest: 'public/img/users' })  // by this we will create a middleware which we can attach to the route wher we Need
const uplode = multer({
    storage: multerStorage,
    fileFilter: mfilter
})

exports.uplodeSinglePhoto = uplode.single('photo')

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
    // console.log(newObj);
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
    console.log(req.file);
    console.log(req.body);
    if (req.body.password || req.body.Cnfpassword) {
        return next(new appError('updatetion of password is  not allowed ', 400));
    }

    // we can simply use find by id and update as we are not handling imp data 
    // but we need to run the validaters for the updated content

    // we do not want to update many fields only the field are provide to be updated 

    const x = updatonly(req.body, 'name', 'email')
    // now for file incoming 
    if (req.file) {
        x.photo = req.file.filename;
    }


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