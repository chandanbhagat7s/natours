const Tour = require('../models/Tour')
const runAsync = require('./../util/runAsync')
const appError = require('../util/appError')



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

exports.getTours = runAsync(async (req, res, next) => {
    // request the data using api from DB
    const tour = await Tour.findOne({ slug: req.params.tourname }).populate({
        path: 'reviews',
        fields: 'review byUser'


    })
    // console.log(tour);
    // if we do not get error 
    if (!tour) return next(new appError('No such tour with name ', 404));



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



exports.myPage = (req, res) => {


    res.status(200).render('account', {
        title: 'Me'
    })
}

















