// using the express module (npm i express)
const path = require('path')
const express = require('express');
const morgan = require('morgan');

const rateLimit = require('express-rate-limit')

const xss = require('xss-clean');
const hpp = require('hpp');
const mongosanitize = require('express-mongo-sanitize');

const helmet = require('helmet');

//bringing error controller
const globalerror = require('./controllers/errorcontrollers');
// bringing error class 
const appError = require('./util/appError')

//bringing userroute
const userRoute = require('./Routes/userroutes')
const tourRoute = require('./Routes/tourroutes')
const reviewRoute = require('./Routes/reviewroute')
const viewRoute = require('./Routes/viewroutes')

// to parese all the cookies from incoming request 
const cookieParser = require('cookie-parser')




// bringing all the function access to app variable 
const app = express();


// for pug , for  dynamic web rendering okk 
app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'views'))


// we will learn to server static file ok 
app.use(express.static(`${__dirname}/public`))
// by this module and middleware the cookies that we set is sent in all the request(further req..s) , after we get cookie info 
app.use(cookieParser())




//  helmate middleware : used for setting the headers 
app.use(helmet())





if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')) // using the thirdparty-middleware

}

// limiting the requses body
app.use(express.json({ limit: '10kb' }))//work as middleware

// if in body specific query is entred then we get the user base on that so we need to use sanatization as middleware
app.use(mongosanitize())
// this middleware filer out all the operater and . okk 

// this middleware filter out all the html code if present then it will be revert
app.use(xss())

// now we are going to use hpp :http parameter pollution 
// while query their is the request by dublicate field like sort=duration&sort=price which create problem 
// and problem is created by attackers  eg: 
//{{URL}}/api/v1/tours?sort=price&sort=duration
// then which is last on base of that request is fulllfiled

// {{URL}}/api/v1/tours?duration=3&duration=9 for this we want both
// then we need to define the whitelist which will contains the list for dublication allowence
app.use(hpp({
    whitelist: ['duration', 'difficulty', 'price', 'maxGroupSize', 'ratngsAvargage', 'ratingsQuantity']
}))


// point creating the miidleware basic  run in the order it is defined before and after the specific routes okk 
app.use((req, res, next) => {
    // console.log("hello from the middleware");
    // console.log(req.url);
    // if (req.url == '/api/v1/user/login') {
    //     console.log(req.url);


    // }
    console.log(req.cookies);
    next()
})


//  point : implementing ratelimiter 
// npm i express -rate-limit
const ratelimiter = rateLimit({
    max: 20, // no of maximum request 
    windowMs: 60 * 60 * 1000,  // reneving in timelimit
    message: "to many request from your ip , please try again after a hour "
})
app.use('/api', ratelimiter);



//point how to do get and post request basic
/*
app.use('/', function (req, res, next) {
    console.log("using the middleware");
    next();
});

// creating the route with 'get' request ..
app.get('/', (req, res) => {

    // res.redirect("www.google.com")
    res.status(200).send("hello i did it");
    console.log(res.headersSent)
    console.log(res.body);
})

app.post('/', (req, res) => {
    res.status(200).json({ massage: "using post " });
    console.log(res.getHeader('Content-type'));
})
*/



/*
//point  now making request to get all the tours
app.get('/api/v1/tours', getTour)

// point now making the request to create a new tour
app.post('/api/v1/tours', createTour)

// point now we will make the use of paramerter provided and send data

app.get('/api/v1/tours/:id', getTourById)

//point now we wil put the patch request okk 
app.patch('/api/v1/tours/:id', updateTourById)


//point now we wil put the delete method okk 
app.delete('/api/v1/tours/:id', deleteTourById)
 */
//removed  : doone the file of it okk 

/**
 //point now we will read the file 
const Tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`))

//starr creating the function 
const getTour = (req, res) => {
    //using SJSON format important 
    res.status(200).json({
        success: true,
        totalresults: Tours.length,
        data: {
            tour: Tours
        }

    })
}
const createTour = (req, res) => {
    console.log(req.body); // adding middleware app.use(express.json())

    // whyy The req.body property is undefined by default in Express because it does not automatically parse the request body. 
    // This is because the request body can be very large, and parsing it can be a performance bottleneck. Instead, Express relies on middleware to parse the request body 




    const newObj = Object.assign({ id: Tours.length + 1 }, req.body);

    Tours.push(newObj);
    // we nee to write into the database (hear file)
    fs.writeFile(`${__dirname}/dev-data/data/tours.json`, JSON.stringify(Tours), err => console.log(err))
    res.status(201).json({
        success: true,
        data: {
            tour: newObj
        }
    })


}
const getTourById = (req, res) => {
    console.log(req.params);
    // we neeed to find the tour in json file (currently)
    const tour = Tours.find(el => el.id == req.params.id)
    if (!tour) {
        //important   return statement 
        return res.status(404).json({
            success: false,
            massage: "data not found"

        })
    }

    res.status(200).json({
        success: true,
        data: {
            tour
        }

    })
}

const updateTourById = (req, res) => {
    res.json({ success: true, data: { tour: 'updated tour hear..' } })

}
const deleteTourById = (req, res) => {
    res.json({ success: true })

}

// starr implementing user routes
const getUser = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
const createUser = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
const getUserById = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
const updateUserById = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
const deleteUserById = (req, res) => {
    res.status(500).json({
        success: "fail",
        massage: "yet to be implemented "
    })
}
 */




// now let us try one more way to run the routesbefore it was like
/*// removed we can do as for tour routes
app.router('/api/v1/tours').get(getTour).post(createTour)
app.router('/api/v1/tours/:id').get(getTourById).patch(updateTourById).delete(deleteTourById)


// for user routes
app.router('/api/v1/user').get(getUser).post(createUser)
app.router('/api/v1/user/:id').get(getUserById).patch(updateUserById).delete(deleteUserById)
 */
// .route   is used for chaining the methods 
// making diffrent file removed
/*const tourRouter = express.Router()  // what i understand on that use for mini-app and easy refactor
const userRouter = express.Router()


// we can do as for tour routes
tourRouter.route('/').get(getTour).post(createTour)
tourRouter.route('/:id').get(getTourById).patch(updateTourById).delete(deleteTourById)


// for user routes
userRouter.route('/').get(getUser).post(createUser)
userRouter.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUserById)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/user', userRouter) */


app.use('/', viewRoute)
app.use('/api/v1/tours', tourRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/review', reviewRoute)

// if any route is avaialble till this point it means it do not belongs to our routes so we need to handle it even okk 
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     massage: `the route ${req.originalUrl} is not a route`
    // })

    //definign error handler 

    // this we can send if their is error anywhare insted of copying we will create class 
    //removed
    // const err = new Error(`the route ${req.originalUrl} is not a route`)
    // err.statuscode = 404;
    // err.status = 'fail'
    // next(err)

    //added
    next(new appError(`the route ${req.originalUrl} is not a route okk `, 404));
})

// now we write the error middleware 
//important : hear node automaticly recourganise the error middleware by seeing err as first argument
// globalerror is the error middleware 
// first we create an error (by error object .. or...)then this error middleware will be called 
app.use(globalerror)


module.exports = app;




















/* "point",
        "about",
        "need",
        "removed",
        "like",
        "done",
        "basic",
        "advanced",
        "important",
        "necessary", */