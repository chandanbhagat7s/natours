const express = require('express');
const revcontroller = require('./../controllers/revcontroller');
const auth = require('./../controllers/authcontrollers');

// we are redirecting the route from the tour hear so inorder to get the access for parameter 
const router = express.Router({ mergeParams: true });


router.use(auth.getVerified)
router.route('/').get(revcontroller.getAllRev).post(auth.getaccess('user'), revcontroller.extINFO, revcontroller.createReview)


router.use(auth.getVerified, auth.getaccess('user'))

router.route('/:id').get(revcontroller.getrevbyid).delete(revcontroller.deleteReview).patch(revcontroller.updateReview)



module.exports = router;




