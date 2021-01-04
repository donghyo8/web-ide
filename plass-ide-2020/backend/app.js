var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();


var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());  
app.use(logger('dev')); 
app.use('/files', express.static('update', {fallthrough: false}),); 
// ------- Create Session -------
createSession = () =>  {
	return function (req, res, next) {
		if (!req.session.login) {
			req.session.login = 'logout';
		}
		next();
	};
};
app.use(session({
	secret: '1234DSFs@adf1234!@#$asd',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 600000 },
}));
app.use(createSession());
// ROUTER 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');
var authRouter = require('./routes/auth');
var lectureRouter = require('./routes/lecture');
var homeworkRouter = require('./routes/homework');
var problemsRouter = require('./routes/problems');
var uploadRouter = require('./routes/upload');
var downloadRouter = require('./routes/download');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/projects', projectsRouter);
app.use('/lectures', lectureRouter);
app.use('/homework', homeworkRouter);
app.use('/problems', problemsRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);

// ERROR HANDLER
var errorHandler = require('./modules/error-handler-middleware');
app.use(errorHandler);
module.exports = app;