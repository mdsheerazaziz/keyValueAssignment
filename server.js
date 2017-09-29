let express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    KeyValue = require('./api/models/keyValueModel'), //created model loading here
    bodyParser = require('body-parser');

let config = require('config');
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


let routes = require('./api/routes/keyValueRoute'); //importing route
routes(app); //register the route


app.listen(port);

module.exports = app; // for testing

console.log('RESTful API server started on: ' + port);
