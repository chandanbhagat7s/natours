const express = require('express');
const router = express.Router()

const userroute = require('./../controllers/usercontrollers')


router.route('/').get(userroute.getUser).post(userroute.createUser)
router.route('/:id').get(userroute.getUserById).patch(userroute.updateUserById).delete(userroute.deleteUserById)


module.exports = router;

