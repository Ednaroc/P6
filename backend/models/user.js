const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

// Calls the model constructor on the Mongoose instance and
// passes it the name of the collection
// and a reference to the schema definition.
module.exports = mongoose.model('User', userSchema);