const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

/* SCHEMA setup */
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Loch Lomond & The Trossachs', 
//     image: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
//     description: 'Mersmerizing nature. Have an unforgettable stay with your favorite animal - quokkas'
//   }, (err, campground) => {
//     if (err) console.log(err);
//     else console.log(campground);
//   }
// )

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
  var newCampground = {name: req.body.name, image: req.body.image};
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
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else res.render('show', {campground: foundCampground});
  });
});

/* start the server */
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });