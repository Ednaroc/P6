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
    }
}

module.exports = new Database();