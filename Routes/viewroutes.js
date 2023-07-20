
const express = require("express")
const router = express.Router()
const viewRoute = require("./../controllers/viewcontrollers")



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


module.exports = router;

