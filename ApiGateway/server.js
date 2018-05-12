var express = require('express'),
    app = express(),
    port = process.env.PORT || 3090,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    cors = require('cors');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/gateway');
var db = mongoose.connection;

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin:['http://localhost:3002'],
    methods:['GET','POST'],
    credentials: true // enable set cookie
}));

var routes = require('./api/routes/gatewayRoute');
routes(app);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, function () {
    console.log('API Gateway Service RESTful API server started on: ' + port);
});
