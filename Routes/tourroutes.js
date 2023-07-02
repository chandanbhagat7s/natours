const express = require('express');

const router = express.Router()
const tourroutes = require('./../controllers/tourcontrollers');
const authroutes = require('./../controllers/authcontrollers');


router.route('/stats').get(tourroutes.stats)
router.route('/topcheaptours').get(tourroutes.aliasroute, tourroutes.getTour)
router.route('/busy/:year').get(tourroutes.busymonth);

router.route('/').get(tourroutes.getTour).post(tourroutes.createTour)
router.route('/:id').get(tourroutes.getTourById).patch(tourroutes.updateTourById).delete(authroutes.getVerified, authroutes.getaccess('admin', 'head'), tourroutes.deleteTourById)

// implementing as user base : authoriztion for deletion of tour routes only by admin 

module.exports = router;