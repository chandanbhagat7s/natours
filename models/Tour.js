const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User');
const { promises } = require('nodemailer/lib/xoauth2');

const tourSchema = new mongoose.Schema({
    // name:String,
    // rating:Number,
    // price:Number
    name: {
        type: String,
        required: [true, "a tour must have a name "],
        unique: [true, "name should be unique"],
        trim: true,
        // maxlength: [100, ' a tour cannot have character more than 40'],
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
        // this is schema type option
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJson : the data type used by mongoose inorder to define geospecial data
        // hear we will define embedded object and inside this object we can define coupl couple of props..
        // inOrder to define geoJson we need two props.. type and coordinate 
        type: {
            type: String,
            default: "Point",
            enum: ['Point']
        },

        coordinates: [Number],  // array of [longitude , latitude]
        address: String,
        discription: String
    },
    // to embedded the documnet we need to creata the array only and inside it need to define the object which will create documnet inside the documnet
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ['Point']
            },

            coordinates: [Number],
            address: String,
            discription: String,
            day: Number
        }
    ],
    // we are going to embdded(for pratice) user document of role tour-guide into the  tour : we will do this into the pre:save middleware
    // we Need to embeed data then only if their will be no updates spacially 
    // think About if guide Updates the role then ......... changes to be Done in tours also 
    // guides: Array

    // now we will refrence the data 
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]


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

// now populating virtual field : to keep the record of review in the tours 
// as we have pparent refrencing , then the tour do not have any way to know About children so we will populate the field 
tourSchema.virtual('reviews', {
    ref: 'Reviews',
    foreignField: 'ofTour',
    localField: '_id'

})

// point : embedding documnet 
/*
// embedding user docuement into tours only of guide 
tourSchema.pre('save', async function (next) {
    // updating the guide : we have id (only of the user with role guide )of user (availabe as array ) from id we will embedd document of user into the tour
    // need to await by ffetching from id , mark the function as async
    const guidePromise = this.guides.map(async id => await User.findById(id))
    // now guidePromise is the promise array and we need to resolve and save to the field of tours 
    this.guides = await Promise.all(guidePromise);
    next();

})

*/

// point : refrencing docuement

// creating index for startlocation in 2D
tourSchema.index(
    { 'startLocation': "2dsphere" }
)



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


tourSchema.pre(/^find/, function (next) {
    // we are populating in the middleware just it will make the second query and give us 
    this.populate({ path: 'guides', select: '-__v' })
    next()
})


// })
// about aggrigation middleware
// what is happning see.. secrate tour is being added into the aggragition .. functionality 
// just we can hide by.. 
tourSchema.pre('aggregate', function (next) {
    // for hiding secrate tour we will add one more stage 
    this.pipeline().unshift({ $match: { secrate: { $ne: true } } })
    // console.log(this.pipeline());
    next()
})





// now we nedd to create the model:for performing the crud , aggragition,operations and query
// variable_to_be_dec_inNODE = mongoose.model(name_fo_model,schema)
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
