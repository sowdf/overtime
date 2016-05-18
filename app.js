var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var nodemailer = require("nodemailer");
var routes = require('./routes/index');
var interface = require('./routes/interface');
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret : settings.cookieSecret,
  key : settings.db,
  cookie : { maxAge :  60 * 100 * 60 * 24 * 30 },
  store : new MongoStore({
    db:settings.db,
    host:settings.host,
    port:settings.port,
    url : 'mongodb://localhost/overtime'
  })
}));


var transport = nodemailer.createTransport("SMTP", {
  host: "smtp.qq.com",
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  auth: {
    user: "773056824@qq.com",
    pass: "bgetucikjwvpbajh"
  }
});

transport.sendMail({
  from : "773056824@qq.com",
  to : "229555644@qq.com",
  subject: "邮件主题",
  generateTextFromHTML : true,
  html : "&lt;p&gt;这是封测试邮件&lt;/p&gt;"
}, function(error, response){
  if(error){
    console.log(error);
  }else{
    console.log("Message sent: " + response.message);
  }
  transport.close();
});


routes(app);
interface(app);

app.listen('8081',function(err){
  console.log('Express is Start on port 8081');
})


