const mongoose = require('mongoose');
const Tour = require('./Tour');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review can not be empty'],
        trim: true,
        maxlength: [500, ' a tour cannot have character more than 500'],
        minlength: [2, ' a tour must have character more than 7 character ']
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

// functionality of not adding same dublicate review from the user for the tour 
reviewSchema.index({ ofTour: 1, byUser: 1 }, { unique: true });






// maing static method 
// static method can be called on the models direcly

// use static method , so we can access model 
// whereas instance method is called on schema
reviewSchema.statics.calcAvgRatingss = async function (tourID) {
    console.log("the tour info is ", tourID);
    // this POINTS to the current model 
    const stats = await this.aggregate([
        {
            $match: { ofTour: tourID }
        }, {
            $group: {
                _id: '$ofTour',
                nRating: { $sum: 1 },
                avgRating: { $avg: "$ratings" }

            }
        }
    ])
    console.log("stats  is ", stats, stats[0].avgRating);
    await Tour.findOneAndUpdate(tourID, {
        ratingAvgarage: stats[0].avgRating,
        ratingQuantity: stats[0].nRating
    })


}

reviewSchema.post('save', function () {
    // this POINTS to the current document which is being saved
    //  as the Reviews variable is not yet defined and we cannot put after the declaration evven it will not work because reviewSchema will not be available 
    // Reviews.calcAvgRatingss   in this way it do not works 
    // this.constructor    -> which will POINTS to the model(constructor is the model who created that document okk )
    // console.log("comming in this");
    this.constructor.calcAvgRatingss(this.ofTour)

})

// now for change in reviewsAVG and count inrespect to update and delete
// heare we cannot use post method because query will not exist till post okk 

// ready to embedd into the object and send the tour info to post req...
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//     console.log("came");
//     let query = this.findOne().clone();
//     // console.log("this is ", this.r);
//     query = await query;
//     this.r = query
//     next()
// })


// reviewSchema.post(/^findOneAnd/, async function () {
//     // // in this.r the reiew information is stored which was updated or deleted okk
//     // console.log("work");
//     // await this.r.constructor.calcAvgRatingss(this.r.ofTour)
//     // // console.log("cameeeeeeeee");
// })

reviewSchema.post(/^findOneAnd/, async function (doc) {
    console.log(typeof doc, doc);
    await doc.constructor.calcAvgRatingss(doc.ofTour);

});

const Reviews = mongoose.model('Reviews', reviewSchema)

module.exports = Reviews












