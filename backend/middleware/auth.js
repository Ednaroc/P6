const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        // To solve the auth issue in the delete request
        // To access the userId in the stuff controler you can add a property
        // to the request object to one piece of middleware and will add it to the next
        // req.userId = userId: the decoded user Id
        // Even better we'll create an auth object on our request object to store any auth data
        // req.auth = { userId: userId}
        req.auth = {userId};
        if (req.body.userId && req.body.userId !== userId) {
            next({'message': 'Invalid user ID'});
        } else {
            next();
        }
    } catch {
        next({'message': 'Invalid request!'});
    }
};