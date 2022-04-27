const mongoose = require('mongoose');
// const {connect, connection} = require('mongoose');
const {config} = require('dotenv');

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        config();
        const uri = process.env.DB_URI;
        mongoose.connect(uri, {
            dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: process.env.DB_PASSWORD,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })   
            .then(() => {
                console.log('Connection established with MongoDB Atlas!');
            })
            .catch((error) => {
                console.log('Unable to connect to MongoDB Atlas!');
                // QUESTION: should I be using error.message instead?
                console.error(error);
            });
        
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB Cluster');
        });
        mongoose.connection.on('error', (error) => {
            console.error(error);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
        // switch (mongoose.connection.on) {
        //     case 'connected':
        //         console.log('Mongoose connected to DB Cluster');
        //         break;
        //     case 'error':
        //         console.error(error);
        //         break;
        //     case 'disconnected':
        //         console.log('Mongoose disconnected');
        //         break;
        // }
    }
}

module.exports = new Database();