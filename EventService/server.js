var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Question = require('./api/models/question'),
    Event = require('./api/models/event');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/event');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var routes = require('./api/routes/eventRoutes');
routes(app);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, function () {
    console.log('Event Service RESTful API server started on: ' + port);
});