// bringing hear the model for crud routes 

const Tour = require('./../models/Tour');

// const fs = require('fs');
// const Tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`))


// bringig hear the runAsync method
const runAsync = require('./../util/runAsync')
const appError = require('./../util/appError')

// adding hear class 
const apiFeature = require('./../util/apiFeature')




//advanced creating allias route
exports.aliasroute = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'ratingAvgarage -price';
    req.query.fields = 'name,duration,rating,difficulty,price'
    next();
}


exports.getTour = runAsync(async (req, res, next) => {

    // removed and created a class of apiFeature
    /*
    
            // using SJSON format important status
            // const allTour = await Tour.find()  // will return the array of document okk
    
            // point  trying with query string filter // need object 
            // what is query : object of the parameter passed after ' ?' is the query string
            // 127.0.0.1:3000/api/v1/tours?difficulty=easy&page=2    { difficulty: 'easy', page: '2' }
            // const allTour = await Tour.find(req.query);
            // find look like db.collection.find({ age: { $gt: 21 } }); 
            // await keyworks resolves the query and bring the output to defined variable okk 
            console.log(req.query);
    
    
    
    
    
    
    
    
    
            // removing other paramerter 
            // const queryobj = { ...req.query }
            // const rkey = ['page', 'limit', 'sort', 'fields']
            // rkey.forEach((el) => delete queryobj[el])
    
    
            // // advance filtering for greter and lesser operaters 
            // // req.query string is like 127.0.0.1:3000/api/v1/tours?price[lte]=2000  object  is like {price:{lte:2000}} need {price : {$lte:2000}}
            // console.log(queryobj);
            // let querystr = JSON.stringify(queryobj)
            // querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
            // let query = Tour.find(JSON.parse(querystr))
    
            //removed await keyword ffor multiple query sring functionality and resolving at the end 
    
            //point sort need string and object even (your choice)
            // if (req.query.sort) {
            //     // for multiple sorting (handling tie)
            //     const sortquery = req.query.sort.split(',').join(' ')
            //     query = query.sort(sortquery)
            // } else {
            //     query = query.sort('createAt')
            // }
    
            //point limiting 
            // if (req.query.fields) {
            //     const limquery = req.query.fields.split(',').join(' ')
            //     query = query.select(limquery) // selcect for only showing the field as provided 
            // } else {
            //     query = query.select('-__v') //- excluding 
            // }
    
            //point limiting and pagination 
    
            // const page = req.query.page * 1;
            // const limit = req.query.limit * 1;
            // const skip = (page - 1) * limit;
    
    
            // query = query.skip(skip).limit(limit);
    
            // if (req.query.page) {
            //     const totaldoc = await Tour.countDocuments();
            //     if (skip >= totaldoc) {
            //         throw new Error('no more resources')
            //     }
            // }
    
    
    
    
            // executing query
            const allTour = await query;
    */

    const apidata = new apiFeature(Tour.find(), req.query).filter().sorte().limiting().pagination();

    const allTour = await apidata.query;

    res.status(200).json({
        status: "success",
        totalresult: allTour.length,
        data: {
            tour: allTour
        }

    })

})

// important point need : we are going to remove the try and catch block 
// remember why we added it just for any error occurs then send the response of error 
// we will do it by error handling okk see how 




exports.createTour = runAsync(async (req, res, next) => {
    //removed try catch 
    //   console.log(req.body); // adding middleware app.use(express.json())
    /*whyy The req.body property is undefined by default in Express because it does not automatically parse the request body. 
 
    This is because the request body can be very large, and parsing it can be a performance bottleneck. Instead, Express relies on middleware to parse the request body */

    // const newTour=new Tour({});  newtour.save().then().catch()
    /*
    what is populate tour : the another request made by mongoose autoamticaly where the refrence 
    is stord in form of id , it will bring all the information of that populated from the path specifed 
    */

    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    });



})
exports.getTourById = runAsync(async (req, res, next) => {

    console.log(req.params);
    // we neeed to find the tour in json file (currently)
    const tours = await Tour.findById(req.params.id).populate('reviews') // same as Tour.findOne({_id:req.params.id})

    //necessary
    if (!tours) {
        return next(new appError('invalid id ', 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            tours
        }

    })

})

exports.updateTourById = runAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true, // to run the validater again before updating
        new: false    // to set the incoming data ok 
    })
    // what is happning if we are providing invalid id then it is sending empty response 
    // insted it should be error    //necessary
    if (!tour) {
        return next(new appError('invalid id ', 404))
    }


    res.status(200).json({
        status: "success",
        data: {
            tour
        }

    })




})


exports.deleteTourById = runAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id)
    //necessary : if id is not present :like : we get the tour as null if invalid id is found 
    if (!tour) {
        // necessary to call return because this error class we called will send response 
        // if we do not provid return then downside response will be send means two response one of errorcall and other of this tourroute okk 
        return next(new appError('invalid id: no tour found  ', 404))
    }
    res.status(200).json({
        status: "success",
        data: null

    })


})


// aggrigation pipeline  
exports.stats = runAsync(async (req, res, next) => {

    const stat = await Tour.aggregate([
        {
            $match: {
                duration: { $gte: 3 }
            }

        },
        {
            $group: {
                _id: '$difficulty',
                avgprice: { $avg: '$price' },
                avgrating: { $avg: '$rating' },
                maxprice: { $max: '$price' },
                minprice: { $min: '$price' },
                totaltour: { $sum: 1 },
                totalprice: { $sum: '$price' }

            }
        },//important we can add furter more // and from hear we cannot access tour daata 
        // the data it has is of group okk 
        {
            $sort: {
                minprice: 1
            }
        }
    ])
    res.status(200).json({
        status: "success",
        data: {
            stat
        }
    })



})

exports.busymonth = runAsync(async (req, res, next) => {


    const year = req.params.year;

    const plan = await Tour.aggregate([
        {
            /* using unwind to separe it out (it is assigned for single this many )=>(what it will do it will assign sepratly one for every other )
          "startDates": [
    "2021-04-25T09:00:00.000Z",
    "2021-07-20T09:00:00.000Z",
    "2021-10-05T09:00:00.000Z"
  ]  */
            $unwind: '$startDates'
        },
        // now we will use match for year range 2021 and 2022
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-01`)
                }
            }
        },
        // now we will limit the field 
        {
            $group: {
                _id: {
                    $month: '$startDates'
                },
                tours: {
                    $push: '$name'
                },
                numberoftourstart: {
                    $sum: 1
                }
            }
        }, // now we will add the fields month 
        {
            $addFields: {
                month: '$_id'
            }
        },// now we will remove the id 
        {
            $project: {
                _id: 0
            }
        },// we can limit the number of result 
        // {
        //     $limit: 3
        // } // we can sort even 
        {
            $sort: {
                month: -1
            }
        }

    ])

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })


})

// we want that user should post the review
//  tours/:tourID/review
//  tours/:tourID/review












