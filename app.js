var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var fs = require("fs");
var rfs = require("rotating-file-stream");

var index = require("./routes/index");
var url = require('url');

//sawagger
var swaggerUi = require("swagger-ui-express");
var swaggerDocument = require("./api/swagger/swagger.json");

var app = express();

const FakeDatabase = require("./db-init");
const fakeDatabase = new FakeDatabase();
fakeDatabase.init();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//swagger
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//winston logger
const winston = require("./config/winston.config");

// setup the logger
app.use(morgan('combined', { stream: winston.stream }))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes
const cameraRouter = require("./routes/camera.router");
const videoRouter = require("./routes/video.router");
const orderRouter = require("./routes/order.router");
const userRouter = require("./routes/user.router");
const fileRouter = require("./routes/file.router");
const productRouter = require("./routes/product.router");
app.use(cameraRouter);
app.use(userRouter);
app.use(fileRouter);
app.use(productRouter);
app.use(videoRouter);
app.use(orderRouter);

// app.use("/", index);


// route for Client
// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});
app.get('/bai-viet/', function(req, res) {
    res.render('pages/bai-viet');
});
app.get('/camera/', function(req, res) {
    res.render('pages/camera');
});
app.get('/dat-hang-ga/', function(req, res) {
    res.render('pages/dat-hang-ga');
});
app.get('/dat-hang-ruou/', function(req, res) {
    res.render('pages/dat-hang-ruou');
});
app.get('/gioi-thieu/', function(req, res) {
    res.render('pages/gioi-thieu');
});
app.get('/lien-he/', function(req, res) {
    res.render('pages/lien-he');
});
app.get('/san-pham-ga/', function(req, res) {
    res.render('pages/san-pham-ga');
});
app.get('/san-pham-ruou/', function(req, res) {
    res.render('pages/san-pham-ruou');
});
app.get('/tin-tuc/', function(req, res) {
    res.render('pages/tin-tuc');
});
app.get('/trang-chu-ga/', function(req, res) {
    res.render('pages/trang-chu-ga');
});
app.get('/trang-chu-ruou/', function(req, res) {
    res.render('pages/trang-chu-ruou');
});
app.get('/video-truc-tuyen-ga/', function(req, res) {
    res.render('pages/video-truc-tuyen-ga');
});
app.get('/video-truc-tuyen-ruou/', function(req, res) {
    res.render('pages/video-truc-tuyen-ruou');
});

// serve static file
app.use('/static',express.static(__dirname + '/public/static'));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// //The 404 Route (ALWAYS Keep this as the last route)
// app.get('*', function(req, res){
//     var urlParts = url.parse(req.url, true);
//     // var urlParams = urlParts.query, 
//     var urlPathname = urlParts.pathname;
//     if(!urlPathname || !urlPathname.startsWith("/static")){
//         res.render('pages/error/404-not-found');
//     }
//     // if resource inside /static is not found => request will be pending forever
// });
app.use(function (req, res, next) {
     return res.render('pages/error/404-not-found');
});

// error handler
var errorMiddleware = require("./middleware/error.middleware");
app.use(errorMiddleware);

module.exports = app;
