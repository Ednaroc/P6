const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Creates and saves a new user to the database, with hashed password
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            // Creates an instance of the model
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => {res.status(201).json({message: 'User added successfully!'});})
                .catch((error) => {next(error);});
        }
    );
};


// Checks user credentials (if user exist and if correct password)
// Returns user _id and JSON web token
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}).then(
        (user) => {
            if (!user) {
                return res.status(401).json({error: new Error('User not found!')});
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({error: new Error('Incorrect password!')});
                    }
                    const token = jwt.sign(
                        {userId: user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: '24h'});
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            ).catch((error) => {next(error);});
        }
    ).catch((error) => {next(error);});
};