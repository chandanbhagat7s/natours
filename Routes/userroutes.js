const express = require('express');
const router = express.Router()

const userroute = require('./../controllers/usercontrollers')
// bringing hear the authcontroller
const authroute = require('./../controllers/authcontrollers');
router.route('/signup').post(authroute.signup)
router.route('/login').post(authroute.login)

router.route('/forgotPassword').post(authroute.forgotPassword)
router.route('/').get(authroute.getVerified, userroute.getUser).post(userroute.createUser)


router.use(authroute.getVerified)
router.route('/getMe').get(userroute.getMe, userroute.getUserById)
router.route('/resetPassword/:token').patch(authroute.resetPassword)
router.route('/updatePassword').patch(authroute.updatePassword)
router.route('/updateMyself').patch(userroute.updateMyself)
router.route('/deleteMyself').delete(userroute.deleteMyself)


router.use(authroute.getaccess('admin'))
router.route('/:id').get(userroute.getUserById).patch(userroute.updateUserById).delete(userroute.deleteUserById)


module.exports = router;

