
const appError = require('./../util/appError')



const handlecastError = (err) => {
    const massage = `invalid data with ${err.path}:${err.value}`
    const statuscode = 400;
    return new appError(massage, statuscode);
}

const handledublicateError = (err) => {
    const value = err.keyValue.name
    // console.log(value);
    const massage = `dublcate field with value : ${value} try another value !`
    return new appError(massage, 400)

}

const handlevalidationError = (err) => {
    const values = Object.values(err.errors).map(e => e.message)
    const massage = values.join('. ')
    return new appError(massage, 400)
}

// for dev 
const indevelopment = (err, res) => {
    const statuscode = err.statusCode || 500;
    const status = err.status || 'error';
    console.log(err.name);

    res.status(statuscode).json({
        status: status,
        massage: err.message,
        error: err,
        stack: err.stack
    })
}

// for production 

const inproduction = (err, res) => {
    // which error are created in our app and we handled
    if (err.isOperational) {


        res.status(err.statusCode).json({
            status: err.status,
            massage: err.message
        })
        // somthing which internal details we do not want to leak
    } else {
        // console.log(err);
        res.status(500).json({
            status: 'fail',
            massage: "something went wrong !!"
        })
    }

}





module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // console.log(process.env);
    if (process.env.NODE_ENV === 'development') {

        indevelopment(err, res)
    } else if (process.env.NODE_ENV === 'production') {

        let error = { ...err };

        // handaling the db id error
        // console.log(err.name);
        // console.log({ err });
        // console.log(error.name);
        if (err.name === 'CastError') {
            // console.log("it is cast error");
            error = handlecastError(error)
        }
        // now for dublicate key error 
        if (err.code === 11000) {
            error = handledublicateError(error)
        }
        // now we will try for validation error 
        if (err.name === 'ValidationError') {
            error = handlevalidationError(error)

        }


        inproduction(error, res)
    }
}