// bringing review model

const runAsync = require('./../util/runAsync');
const appError = require('./../util/appError');
const Reviews = require('./../models/Review');
const factory = require('./factory')

// const packageName = require('./../util/');


exports.extINFO = (req, res, next) => {
    if (!req.body.byUser) {
        req.body.byUser = req.user._id
    }
    if (!req.body.ofTour) {
        req.body.ofTour = req.params.tourID
    }
    next()
}


exports.createReview = factory.createOne(Reviews)

/*runAsync(async (req, res, next) => {
    // for nested route : 
  
 
 
    const rev = await Reviews.create({
        review: req.body.review,
        byUser: req.body.byUser,
        ofTour: req.body.ofTour,
        ratings: req.body.ratings
    })
 
    if (!rev) {
        next(new appError('create the review .. to be posted', 404))
    }
    res.status(201).json({
        status: 'success',
        data: {
            rev
        }
    })
 
 
}) */


exports.getAllRev = runAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.tourID) {
        filter = { ofTour: req.params.tourID }
    }

    const data = await Reviews.find(filter)
    if (!data) {
        res.status(200).json({
            status: 'success',
            massage: "no review posted"
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            data
        }
    })


})


exports.deleteReview = factory.deleteOne(Reviews)
exports.updateReview = factory.updateOne(Reviews)

/**
 exports.updateReviewById = runAsync(async (req, res, next) => {
    const forTour= await Reviews.find({'ofTour':req.body.ofTour})

    // first checking the user is able to update the review or not 
    const userID=req.user._id
    if (!userID) {
        next(new appError('you do not have access to update',403))
    }

    // getting the review documnet on base of userID
    const revuser = await Reviews.find({'byUser':userID})
    if (!revuser) {
        res.status(200).json({
            status: 'success',
            massage:"no review posted"
        })
    }
    if (forTour._id) {
        
    }

    


    const data=await Reviews.findByIdAndUpdate(forTour._id,req.body.review,{
        runValidators:true,
        new: false  
    })
   

    res.status(201).json({
        status: 'success',
        data:{
            data
        }
    })


})
 */










