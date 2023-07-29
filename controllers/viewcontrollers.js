const Tour = require('../models/Tour')
const runAsync = require('./../util/runAsync')



exports.getOverview = runAsync(async (req, res, next) => {
    // request for all the tour 
    const tours = await Tour.find()
    // create template 
    // render the data on site

    res.status(200).render('overview', {
        title: 'all tours',
        tours
    })
})

exports.getTours = runAsync(async (req, res) => {
    // request the data using api from DB
    const tour = await Tour.findOne({ slug: req.params.tourname }).populate({
        path: 'reviews',
        fields: 'review byUser'


    })
    // console.log(tour);



    res.status(200).render('tour', {
        title: tour.name,
        tour
    })
})


exports.getLoginPage = (req, res) => {
    // request the data using api from DB

    // console.log(tour);



    res.status(200).render('login', {
        title: 'chandna'
    })
}


















