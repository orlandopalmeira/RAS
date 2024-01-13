// Passport config
require('dotenv').config();
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var User = require('./models/users');
var usersRouter = require('./routes/index');

console.log(process.env)

var mongoose = require('mongoose');
//var mongodb = 'mongodb://root:password@localhost:27017/users?authSource=admin';
//var mongodb = 'mongodb://127.0.0.1/users';
//mongoose.connect(mongodb,{});
var mongodb = process.env.MONGODB_URL || `mongodb://127.0.0.1/${process.env.DATABASE}`; //! MONGODB_URL definida no docker-compose
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.on('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
})

// Passport config
passport.use(new LocalStrategy({usernameField: 'email'}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(session({
    secret: require('crypto').randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: true
}));
app.use(passport.session());
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.status(404).json({erro: err, mensagem: "Pedido não suportado."});
});

module.exports = app;