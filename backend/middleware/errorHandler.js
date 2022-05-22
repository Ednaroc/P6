function NewErrorHandler(Error, req, res, next) {
    res.status(Error.status || 500);
    res.send({'error': true, 'message': Error.message || 'Internal server error'})
};

module.exports = NewErrorHandler;