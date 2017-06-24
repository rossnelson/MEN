import * as mongoose from 'mongoose';

const ExampleSchema = new mongoose.Schema({
    'prop': { 'type': Number, 'required': true },
}, { 'strict': true });

export = mongoose.model('Example', ExampleSchema);
