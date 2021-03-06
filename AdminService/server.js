var express = require('express'),
    app = express(),
    port = process.env.PORT || 3030,
    dbURL = process.env.DBURL || 'mongodb://localhost:27017/admin',
    mongoose = require('mongoose'),
    Admin = require('./api/models/admin'),
    bodyParser = require('body-parser'),
    cors = require('cors');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(dbURL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var corsOptions = {
    origin: true,
    methods:['GET','POST', 'PUT', 'DELETE'],
    credentials: true,
    maxAge: 3600
};

app.use(cors(corsOptions));

var routes = require('./api/routes/adminRoutes');
routes(app);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});
try{
    app.listen(port, function () {
        console.log('Admin Service RESTful API server started on: ' + port);
    });
} catch(e) {console.log(e)}
