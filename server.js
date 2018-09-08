const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');

const compression = require('compression')
const helmet = require('helmet')



const container = require('./container');



container.resolve(function (users,_, admin,home) {

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://admin:passw0rd@ds145562.mlab.com:45562/footballkik', { useMongoClient: true });

    const app = SetupExpress();

    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, function () {
            console.log('Listening on port 3000')
        });
        ConfigureExpress(app);

        //Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);

        app.use(router);

        app.use(function (req, res) {
            res.render('404');
        });
    }

    function ConfigureExpress(app) {

        app.use(compression());
        app.use(helmet());


        require('./passport/passport-local');
        require('./passport/passport-facebook');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());

        app.use(session({
            secret: 'addyourownsecretkey',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({ mongooseConnection: mongoose.connection })
        }));

        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());


        app.locals._ = _;
    }

});