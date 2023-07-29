
const express = require("express")
const router = express.Router()
const viewRoute = require("./../controllers/viewcontrollers")
const authRoute = require("./../controllers/authcontrollers")


// in this middleware we are bringing he user data from tthe jwt token for rendering the diffrent pages for loggid in and not logedd in user
// The user variable will be populated with the user data that was set by the middleware.
router.use(authRoute.isLoggedIn)
// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//         // setting up the properties 
//         tour: 'natoursss',
//         user: "chandan"
//     });
//     // the file name provided will be searched in the views/  okk declared above
// })
router.get('/', viewRoute.getOverview)

router.get('/tour/:tourname', viewRoute.getTours)

router.get('/login', viewRoute.getLoginPage)


module.exports = router;

