var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
const session = require('express-session');
var fileUpload = require('express-fileupload');
var cors = require('cors');

var loginRouter = require('./routes/admin/login');
var adminproductosRouter = require('./routes/admin/productos');
var adminrecetasRouter = require('./routes/admin/recetas');
var apiRouter = require('./routes/api');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Expertoo20230', //semilla de forma oculta
  resave: false,
  saveUninitialized: true,

}))

secured = async (req, res, next) => {
  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login');

    }

  } catch (error) {
    console.log(error);
  }

}

app.use(fileUpload({
  useTempFiles:true, //para que no se pierda el archivo temporal en caso de un fallo del servidor  
  tempFileDir: '/tmp/'
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/productos', secured, adminproductosRouter);
app.use('/admin/recetas', secured, adminrecetasRouter);
app.use('/api', cors(), apiRouter);

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
  res.render('error');
});


module.exports = app;
