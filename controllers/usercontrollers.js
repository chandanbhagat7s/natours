


const runAsync = require('./../util/runAsync')
const User = require('./../models/User');








exports.getUser = runAsync(async (req, res, next) => {

    const alluser = await User.find();

    res.status(200).json({
        status: "success",
        data: {
            tour: alluser
        }

    })
})
exports.createUser = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
exports.getUserById = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
exports.updateUserById = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
exports.deleteUserById = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}