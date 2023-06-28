class appError extends Error {
    //con.. function runs when object is created with class
    constructor(message, statusCode) {
        super(message);

        // for statuscode 
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
        // for while printing stacktrace : for not appering into the stacktrace this constructor function...
    }
}

module.exports = appError;













