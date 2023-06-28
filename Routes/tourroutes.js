const express = require('express');

const router = express.Router()
const tourroutes = require('./../controllers/tourcontrollers');


router.route('/stats').get(tourroutes.stats)
router.route('/topcheaptours').get(tourroutes.aliasroute, tourroutes.getTour)
router.route('/busy/:year').get(tourroutes.busymonth);

router.route('/').get(tourroutes.getTour).post(tourroutes.createTour)
router.route('/:id').get(tourroutes.getTourById).patch(tourroutes.updateTourById).delete(tourroutes.deleteTourById)



module.exports = router;