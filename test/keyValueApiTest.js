//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let KeyValueModel = require('../api/models/keyValueModel');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
describe('KeyValue Tests', () => {

    beforeEach((done) => { //Before each test we empty the database
        KeyValueModel.remove({}, (err) => {
            done();
        });
    });


    describe('/GET Get value without timestamp ', () => {
        /**
         * Positive Test Cases
         * **/
        it('it should GET value for the give key', (done) => {
            let date = new Date()
            let timestamp = Math.floor((date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000);
            var keyValueData = new KeyValueModel({ key: "mykey", value: "value1", timestamp: timestamp});
            keyValueData.save((err, keyValueData) => {
                chai.request(server)
                    .get('/object/'+keyValueData.key)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('value');
                        res.body.should.have.property('value').eql(keyValueData.value);
                        done();
                    });
            });
        });
        it('it should GET the update value for the give key', (done) => {
            // Saving the Data in DB
            let date = new Date();
            let timestamp = Math.floor((date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000);
            let keyValueData = new KeyValueModel({ key: "mykey", value: "value1", timestamp: timestamp});
            keyValueData.save();

            let timestamp2 = timestamp+10;
            let keyValueData2 = new KeyValueModel({ key: "mykey", value: "value2", timestamp: timestamp2});
            keyValueData2.save((err, keyValueData2) => {
                chai.request(server)
                    .get('/object/'+keyValueData2.key)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('value');
                        res.body.should.have.property('value').eql(keyValueData2.value);
                        done();
                    });
            });
        });

        /**
         * Negative Test Cases
         * **/
        it('if no key is given', (done) => {
            chai.request(server)
                .get('/object/')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('if key is not present in db', (done) => {
            chai.request(server)
                .get('/object/testingkey')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.should.have.property('message').eql('No Data Found');
                    done();
                });
        });
    });



    describe('/GET Get value with timestamp ', () => {
        /**
         * Positive TestCases
         * */
        it('it should GET value for the give key and timestamp', (done) => {
            let date = new Date()
            let timestamp = Math.floor((date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000);
            var keyValueData = new KeyValueModel({ key: "mykey", value: "value1", timestamp: timestamp});
            keyValueData.save((err, keyValueData) => {
                chai.request(server)
                    .get('/object/'+keyValueData.key+'?timestamp='+keyValueData.timestamp)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('value');
                        res.body.should.have.property('value').eql(keyValueData.value);
                        done();
                    });
            });
        });

        it('it should GET value for the give key and timestamp less than the saved value', (done) => {
            let date = new Date()
            let timestamp = Math.floor((date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000);
            var keyValueData = new KeyValueModel({ key: "mykey", value: "value1", timestamp: timestamp});
            keyValueData.save();

            let timestamp2 = timestamp+10;
            var keyValueData2 = new KeyValueModel({ key: "mykey", value: "value2", timestamp: timestamp2});
            keyValueData2.save((err, keyValueData2) => {
                chai.request(server)
                    .get('/object/'+keyValueData2.key+'?timestamp='+keyValueData.timestamp)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('value');
                        res.body.should.have.property('value').eql(keyValueData.value);
                        done();
                    });
            });
        });
        it('it should GET value for the give key and timestamp greater than the saved value', (done) => {
            let date = new Date()
            let timestamp = Math.floor((date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000);
            let keyValueData = new KeyValueModel({ key: "mykey", value: "value2", timestamp: timestamp});
            let timestamp2 = timestamp + 10
            keyValueData.save((err, keyValueData) => {
                chai.request(server)
                    .get('/object/'+keyValueData.key+'?timestamp='+timestamp2)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('value');
                        res.body.should.have.property('value').eql(keyValueData.value);
                        done();
                    });
            });
        });
        /**
         * Negative TestCases
         * */
        it('it should GET value for the give key and wrong timestamp', (done) => {
            let date = new Date()
            let timestamp = Math.floor((date.getTime() + date.getTimezoneOffset() * 60 * 1000) / 1000);
            let keyValueData = new KeyValueModel({ key: "mykey", value: "value2", timestamp: timestamp});
            let timestamp2 = 1234
            keyValueData.save((err, keyValueData) => {
                chai.request(server)
                    .get('/object/'+keyValueData.key+'?timestamp='+timestamp2)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message');
                        res.body.should.have.property('message').eql('No Data Found');
                        done();
                    });
            });
        });
    });

    describe('/POST Object with key and value', () => {
        /**
         * Positive Test Cases
         */
        it('it should POST a key value pair', (done) => {
            let keyValueData = {
                key: "mykey",
                value: "value1"
            }
            chai.request(server)
                .post('/object')
                .send(keyValueData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('key');
                    res.body.should.have.property('value');
                    res.body.should.have.property('timestamp');
                    res.body.should.have.property('key').eql(keyValueData.key);
                    res.body.should.have.property('value').eql(keyValueData.value);
                    done();
                });
        });

        /**
         * Negative Test Cases
         */
        it('it should not POST a key value pair where key is missing', (done) => {
            let keyValueData = {
                value: "value1"
            }
            chai.request(server)
                .post('/object')
                .send(keyValueData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Bad Request');
                    done();
                });
        });

        it('it should not POST a key value pair where value is missing', (done) => {
            let keyValueData = {
                key: "mykey"
            }
            chai.request(server)
                .post('/object')
                .send(keyValueData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Bad Request');
                    done();
                });
        });
        it('it should not POST a key value pair where both key and value is missing', (done) => {
            let keyValueData = {
            }
            chai.request(server)
                .post('/object')
                .send(keyValueData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('Bad Request');
                    done();
                });
        });
    });

});