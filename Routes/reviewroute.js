const express = require('express');
const revcontroller = require('./../controllers/revcontroller');
const auth = require('./../controllers/authcontrollers');

// we are redirecting the route from the tour hear so inorder to get the access for parameter 
const router = express.Router({ mergeParams: true });



router.route('/').get(revcontroller.getAllRev).post(auth.getVerified, auth.getaccess('user'), revcontroller.createReview)




module.exports = router;




