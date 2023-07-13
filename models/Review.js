const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review can not be empty'],
        trim: true,
        maxlength: [500, ' a tour cannot have character more than 500'],
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


// making it for calculaiting the avrage rating and number of rating , using aggrigation and static method okk on the schema 








// maing static method 
// static method can be called on the models direcly

// whereas instance method is called on schema
reviewSchema.statics.calcAvgRatingss = async function (tourID) {
    // this POINTS to the current model 
    const stats = await this.aggregate([
        {
            $match: { tour: tourID }
        }, {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }

            }
        }
    ])
    console.log(stats);

}

reviewSchema.post('save', function () {
    // this POINTS to the current document okk 
    //  as the Reviews variable is not yet defined and we cannot put after the declaration evven it will not work because reviewSchema will not be available 
    // Reviews.calcAvgRatingss   in this way it do not works 
    // this.constructor    -> which will POINTS to the model
    this.constructor.calcAvgRatingss(this.tour)
})




const Reviews = mongoose.model('Reviews', reviewSchema)

module.exports = Reviews












