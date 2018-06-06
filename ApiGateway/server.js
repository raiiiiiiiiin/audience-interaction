var express = require('express'),
    app = express(),
    port = process.env.PORT || 3090,
    dbURL = process.env.DBURL || 'mongodb://localhost:27017/gateway',
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    cors = require('cors'),
    cluster = require('cluster')
    numCPUs = require('os').cpus().length;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(dbURL);
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

var corsOptions = {
    origin: true,
    methods:['GET','POST', 'PUT', 'DELETE'],
    credentials: true,
    maxAge: 3600
};

app.use(cors(corsOptions));

var routes = require('./api/routes/gatewayRoute');
routes(app);
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    try{
        app.listen(port, () => {
            console.log('API Gateway Service RESTful API server started on: ' + port);
        });
    } catch(e) {console.log(e)}
    console.log(`Worker ${process.pid} started`);
}