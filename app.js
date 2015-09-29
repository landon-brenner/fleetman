var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database file setup - check if DB exists, require SQLite3
var fs = require('fs');
var dbfile = path.join(__dirname,'db','test.db');
var dbexists = fs.existsSync('dbfile');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbfile);

// Create the DB if it doesn't exist and throw some random data in it
db.serialize(function() {
  if(!dbexists) {
    db.run('CREATE TABLE Stuff (Thing TEXT)');
  }
  var stmt = db.prepare('INSERT INTO Stuff VALUES (?)');
  // Insert some stuff
  var rnd;
  for (i=0; i<10; ++i) {
    rnd = Math.floor(Math.random() * 10000000);
    stmt.run('Thing #' + rnd);
  }
});

// require routes, users
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // use only one view engine
//app.set('view engine', 'ejs'); // use only one view engine

// use middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

// create the HTTP server
var server = app.listen(3000, function() {
  console.log('Listening on port 3000');
});
