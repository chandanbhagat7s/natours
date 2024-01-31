const express = require('express');

const router = express.Router()
const tourroutes = require('./../controllers/tourcontrollers');
const authroutes = require('./../controllers/authcontrollers');
// const reviewroute = require('./../controllers/revcontroller') insted of controller , we will import router 
const revRouter = require('./reviewroute')


// implementing the route for tours review created by user 
// router.route('/:tourID/reviews').post(authroutes.getVerified, authroutes.getaccess('user'), reviewroute.createReview)
// insted
router.use('/:tourID/reviews', revRouter)

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourroutes.toursWithin)
router.route('/stats').get(tourroutes.stats)
router.route('/topcheaptours').get(tourroutes.aliasroute, tourroutes.getTour)
router.route('/busy/:year').get(tourroutes.busymonth);

router.use(authroutes.getVerified, authroutes.getaccess('admin'))
router.route('/').get(tourroutes.getTour).post(tourroutes.createTour)
router.route('/:id').get(tourroutes.getTourById).patch(tourroutes.uplodeTourImages, tourroutes.resizeTourImages, tourroutes.updateTourById).delete(authroutes.getVerified, authroutes.getaccess('admin', 'head'), tourroutes.deleteTourById)

// implementing as user base : authoriztion for deletion of tour routes only by admin 


module.exports = router;