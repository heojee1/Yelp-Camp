const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategey = require('passport-local'),
      User = require('./models/user'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      seedDB = require('./seeds');

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

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
  next();
});

/* delete all and populate DB with seed data */
seedDB();

/* get landing page */
app.get('/', (req, res) => {
  res.render('landing');
});

/* INDEX - show all campgrouds */
app.get('/campgrounds', (req, res) => {
  console.log('**** ', req.user);
  Campground.find({}, (err, campgrounds) => {
    if(err) console.log(err);
    else res.render('campgrounds/index', {campgrounds: campgrounds});
  })
});

/* CREATE - add new campground to DB */
app.post('/campgrounds', (req, res) => {
  var newCampground = req.body.campground;
  Campground.create(newCampground, (err, campground) => {
    if (err) console.log(err);
    else {
      console.log(newCampground);
      res.redirect('/campgrounds');
    }
  });
});

/* NEW - show form to create new campground */
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

/* SHOW - show more information about a campground */
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) console.log(err);
    else res.render('campgrounds/show', {campground: foundCampground});
  });
});

// =================
// ==== coments ====
// =================

/* NEW - show form to add new comment */
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else res.render('comments/new', {campground: foundCampground});
  });
});

/* CREATE - add new comment to campground and DB */
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  const newComment = req.body.comment;
  Comment.create(newComment, (err, comment) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) console.log(err);
        else {
          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect(`/campgrounds/${foundCampground._id}`);
        }
      });
    }
  });
});

// =====================
// ==== AUTH Routes ====
// =====================

/* SHOW - show sign up form */
app.get('/register', (req, res) => {
  res.render('auth/register');
});

/* handle sing up request */
app.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('auth/register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

/* SHOW - show login form */
app.get('/login', (req, res) => {
  res.render('auth/login');
})

/* handle login request */
app.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), (req, res) => {
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
})

/* start the server */
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }