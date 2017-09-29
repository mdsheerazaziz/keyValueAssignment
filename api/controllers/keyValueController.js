/**
 * Created by sheeraz on 29/9/17.
 */
'use strict';
let mongoose = require('mongoose'),
    KeyValue = mongoose.model('KeyValue');


exports.create_an_object = function (req, res) {
    let body = req.body;
    if (body.key === undefined || body.value === undefined) {
        res.status(400);
        res.json({'error': 'Bad Request'})
    } else {
        let date = new Date();

        let timestamp = {timestamp: Math.floor((date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000)};
        let new_object = new KeyValue(Object.assign(body, timestamp));
        new_object.save(function (err, resp) {
            if (err)
                res.send(err);
            res.json({'key': resp['key'], 'value': resp['value'], 'timestamp': resp['timestamp']});
        });
    }

};


exports.read_an_object = function (req, res) {
    let timestamp = req.query.timestamp;
    let query = {key: req.params.key};
    if (timestamp !== undefined) {
        query = Object.assign(query, {'timestamp': {$lte: timestamp}})
    }
    KeyValue.find(query, [], {sort: {'timestamp': -1}, limit: 1}, function (err, value) {
        if (err)
            res.send(err);
        let res_json;
        if (value.length <= 0) {
            res_json = {'message': 'No Data Found'}
        }
        else {
            res_json = {'value': value[0]['value']}
        }
        res.json(res_json);
    });
};
