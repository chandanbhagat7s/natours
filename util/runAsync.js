module.exports = fn => {
    return (req, res, next) => {

        // fn(req,res,next).catch(err=>next(err)) //  important important : a argument passed into callback 
        // sutomatically passed into the function in JS  
        fn(req, res, next).catch(next);
    };

};