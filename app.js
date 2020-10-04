/* require packages */
const express             = require('express'),
      app                 = express(),
      bodyParser          = require('body-parser'),
      mongoose            = require('mongoose'),
      methodOverride      = require('method-override'),
      passport            = require('passport'),
      LocalStrategey      = require('passport-local'),
      flash               = require('connect-flash'),
      User                = require('./models/user'),
      seedDB              = require('./seeds');

/* require routes */
const campgroundRoutes    = require('./routes/campgrounds'),
      commentRoutes       = require('./routes/comments'),
      authRoutes          = require('./routes/auth'),
      indexRoutes         = require('./routes/index');


mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');   
app.use(express.static(__dirname + '/public')); 
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT configuration
app.use(require('express-session')({
  secret: "Jeewon Heo is an amazing human/genius!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// include current user object in all routes 
app.use((req, res, next) =>  {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', authRoutes);
app.use('/', indexRoutes);

/* delete all and populate DB with seed data */
// seedDB();

/* start the server */
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });