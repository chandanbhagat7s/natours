const runAsync = require('./../util/runAsync')
const appError = require('./../util/appError')


exports.deleteOne = Model => runAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
        return next(new appError('no documnet found   ', 404))
    }
    res.status(200).json({
        status: "success",
        data: null

    })
})


exports.updateOne = Model => runAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: false
    })

    if (!doc) {
        return next(new appError('cannot find document with this id ', 404))
    }


    res.status(200).json({
        status: "success",
        data: {
            data: doc
        }

    })

})


exports.createOne = Model => runAsync(async (req, res, next) => {

    const doc = await Model.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    });



})


exports.getOne = Model => runAsync(async (req, res, next) => {

    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new appError("No document found with that id.", 404
    ))

    res.status(200).json({
        status: "success",
        data: {
            data: doc
        }
    });



})











