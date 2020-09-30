const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      seedDB = require('./seeds');

app.use(express.static('public'));
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
    else res.render('index', {campgrounds: campgrounds});
  })
});

/* CREATE - add new campground to DB */
app.post('/campgrounds', (req, res) => {
  var newCampground = {
    name: req.body.name, 
    image: req.body.image,
    description: req.body.description
  };
  Campground.create(newCampground, (err, campground) => {
    if (err) console.log(err);
    else res.redirect('/campgrounds');
  });
});

/* NEW - show form to create new campground */
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

/* SHOW - show more information about a campground */
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) console.log(err);
    else res.render('show', {campground: foundCampground});
  });
});

/* start the server */
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });