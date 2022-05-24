const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');
require('./initDB');

const newErrorHandler = require('./middleware/errorHandler');

const app = express();

// Adds headers to the response object to avoid CORS errors
// This will allow requests from all origins to access your API. 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// For any incoming request of Content-type == application/json
// => extract the request JSON body and put it in the req object as a body property (req.body).
app.use(express.json());

// To serve the static image directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Set the endpoint and then the router to be used
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

app.use(newErrorHandler);

module.exports = app;