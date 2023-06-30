const express = require('express');
const router = express.Router()

const userroute = require('./../controllers/usercontrollers')
// bringing hear the authcontroller
const authroute = require('./../controllers/authcontrollers');
router.route('/signup').post(authroute.signup)


router.route('/').get(userroute.getUser).post(userroute.createUser)
router.route('/:id').get(userroute.getUserById).patch(userroute.updateUserById).delete(userroute.deleteUserById)


module.exports = router;

