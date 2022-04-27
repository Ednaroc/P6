const mongoose = require('mongoose');
// const {config} = require('dotenv');

const user = 'AdminP6:0K9RfXhHPup96aos';
const database = 'ClusterP6';

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose.connect(`mongodb+srv://${user}@clusterp6.uhlwi.mongodb.net/${database}?retryWrites=true&w=majority`)   
            .then(() => {
                console.log('Successfully connected to MongoDB Atlas!');
            })
            .catch((error) => {
                console.log('Unable to connect to MongoDB Atlas!');
                // QUESTION: should I be using error.message instead?
                console.error(error);
            });
    }
}

module.exports = new Database();