function NewErrorHandler(Error, req, res, next) {
    res.status(Error.status || 500);
    res.send({'error': true, 'message': Error.message || 'Internal server error'})
};

// function NewErrorHandler (err, req, res, next) {
//     res.status(500)
//     res.render('error', { error: err })
// }

module.exports = NewErrorHandler;
