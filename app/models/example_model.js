const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
    'prop': { 'type': Number, 'required': true },
}, { 'strict': true });

module.exports = mongoose.model('Example', ExampleSchema);
