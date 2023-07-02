const express = require('express');
const router = express.Router()

const userroute = require('./../controllers/usercontrollers')
// bringing hear the authcontroller
const authroute = require('./../controllers/authcontrollers');
router.route('/signup').post(authroute.signup)
router.route('/login').post(authroute.login)


router.route('/forgotPassword').post(authroute.forgotPassword)
router.route('/resetPassword/:token').patch(authroute.resetPassword)
router.route('/updatePassword').patch(authroute.getVerified, authroute.updatePassword)


router.route('/').get(authroute.getVerified, userroute.getUser).post(userroute.createUser)
router.route('/:id').get(userroute.getUserById).patch(userroute.updateUserById).delete(userroute.deleteUserById)


module.exports = router;

