/**
 * Created by sheeraz on 29/9/17.
 */

'use strict';
module.exports = function (app) {
    let keyValueList = require('../controllers/keyValueController');

    // todoList Routes
    app.route('/object')
        .post(keyValueList.create_an_object);


    app.route('/object/:key')
        .get(keyValueList.read_an_object);
};
