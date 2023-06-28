const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    // name:String,
    // rating:Number,
    // price:Number
    name: {
        type: String,
        required: [true, "a tour must have a name "],
        unique: [true, "name should be unique"],
        trim: true,
        maxlength: [40, ' a tour cannot have character more than 40'],
        minlength: [7, ' a tour must have character more than 7 character '],

    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "a tour must have a durations"],


    },
    maxGroupSize: {
        type: Number,
        required: [true, "a tour must have a group size"],
    },
    difficulty: {
        type: String,
        required: [true, "a tour must have a difficulty"],
        // enum: {
        //     values: ['easy', 'difficult', 'medium'],
        //     message: 'it can be only : easy , difficult or  medium'
        // }
    },

    rating: {
        type: Number,
        default: 4.5,
        max: [5, 'the rating must be below 5'],
        min: [1, 'the rating must be above 1'],
    },
    ratingAvgarage: {
        type: Number,
        default: 4.5,
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "a tour must have a price"],
    },
    PriceDiscount: {
        type: Number,
    },
    summary: {
        type: String,
        trim: true,


    },
    description: {
        type: String,
        require: [true, "a tour must have the description"],
        trim: true,
    },
    imageCover: {
        type: String,
        require: [true, "a tour must have the cover image"],
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now(),
        select: false  // important this will not be passed as the response okk only this field

    },
    startDates: [Date],

    // advanced define new field for secrate tour
    secrate: {
        type: Boolean,
        default: false
    }

},
    {
        //options
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })
//point now we will add vartual properties 
tourSchema.virtual('durationInWeek').get(function () {
    return this.duration / 7;
})// we need to define options in the schema 

/*//about documnet middleware : only runs for save and create 
tourSchema.pre('save', function (next) {
    // what is plan see : we will save the name into lowecase in definded schema property slug
    this.slug = slugify(this.name, { lower: true })
    next()
})
// post middleware 
tourSchema.post('save', function (doc, next) {
    // what is plan see : we will save the name into lowecase in definded schema property slug
    console.log(doc);
    next()
}) */

/*// about query middleware
// idea is : suppose we have secreate tour and we do not want that anyone to access it 
// then it can be donne by modefying the query string by not passing the secreate tour (can be donne with the querymiddleware) we want that anyone should not access the data of secrate field in any condition 
// tourSchema.pre(/^find/, function (next) {
//     // we define in schema the secrate field
//     // converted to regEX for all find.....
//     this.find({ secrate: { $ne: true } })

//     next()
// })
// theie is also the post method for this query string  */
tourSchema.pre(/^find/, function (next) {
    // we define in schema the secrate field
    // converted to regEX for all find.....
    this.find({ secrate: { $ne: true } })

    next()
})
// })
// about aggrigation middleware
// what is happning see.. secrate tour is being added into the aggragition .. functionality 
// just we can hide by.. 
tourSchema.pre('aggregate', function (next) {
    // for hiding secrate tour we will add one more stage 
    this.pipeline().unshift({ $match: { secrate: { $ne: true } } })
    console.log(this.pipeline());
    next()
})





// now we nedd to create the model:for performing the crud , aggragition,operations and query
// variable_to_be_dec_inNODE = mongoose.model(name_fo_model,schema)
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
