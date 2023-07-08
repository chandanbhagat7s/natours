const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review can not be empty'],
        trim: true,
        maxlength: [100, ' a tour cannot have character more than 40'],
        minlength: [, ' a tour must have character more than 7 character ']
    },
    ratings: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    byUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to user ']
    },
    ofTour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to tour ']
    }

},
    {
        //options
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }



)

// query middleware for populating user data 

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'byUser', select: 'name'
    // }).populate({
    //     path: 'ofTour', select: 'name'
    // })
    // we want to populate only users so we used it for only for users
    this.populate({
        path: 'byUser', select: 'name'
    })
    next()
})


const Reviews = mongoose.model('Reviews', reviewSchema)

module.exports = Reviews












