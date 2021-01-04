var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var io = require('socket.io')
require('dotenv').config();

var app = express();
app.io = io();
app.io.set('origins', '*:*');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var login = require('./modules/check-login-middleware');
app.use(login.injectUser);

// ROUTER 
var indexRouter = require('./routes/index');
var projectsRouter = require('./routes/projects');
var authRouter = require('./routes/auth');
var reportsRouter = require('./routes/reports');
var problemsRouter = require('./routes/problems');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/projects', projectsRouter);
projectsRouter.compile(app.io);
problemsRouter(app.io)
app.use('/reports', reportsRouter);



// ERROR HANDLER
var errorHandler = require('./modules/error-handler-middleware');

app.use(errorHandler);

module.exports = app;