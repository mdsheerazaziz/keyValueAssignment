/**
 * Created by sheeraz on 29/9/17.
 */
'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let KeyValueSchema = new Schema({
    key: {
        type: String,
        required: 'Key is mandatory'
    },
    value: {
        type: String,
        required: 'Value is mandatory'
    },
    timestamp: {
        type:Number
    }
});

module.exports = mongoose.model('KeyValue', KeyValueSchema);