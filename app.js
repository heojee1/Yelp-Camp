const { findById } = require('./models/campground');

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
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

/* delete all and populate DB with seed data */
seedDB();

/* get landing page */
app.get('/', (req, res) => {
  res.render('landing');
});

/* INDEX - show all campgrouds */
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if(err) console.log(err);
    else res.render('campgrounds/index', {campgrounds: campgrounds});
  })
});

/* CREATE - add new campground to DB */
app.post('/campgrounds', (req, res) => {
  var newCampground = req.body.compground;
  Campground.create(newCampground, (err, campground) => {
    if (err) console.log(err);
    else res.redirect('/campgrounds');
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
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else res.render('comments/new', {campground: foundCampground});
  });
});

/* CREATE - add new comment to campground and DB */
app.post('/campgrounds/:id/comments', (req, res) => {
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

/* start the server */
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });