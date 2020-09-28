const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

var campgrounds = [
  {name: 'Mount Cook National Park', image: 'https://images.unsplash.com/photo-1511993807578-701168605ad3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
  {name: 'Loch Lomond & The Trossachs', image: 'https://images.unsplash.com/photo-1488790881751-9068aa742b9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
  {name: 'Sierra Nevada National Park', image: 'https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
  {name: 'Mount Cook National Park', image: 'https://images.unsplash.com/photo-1511993807578-701168605ad3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
  {name: 'Loch Lomond & The Trossachs', image: 'https://images.unsplash.com/photo-1488790881751-9068aa742b9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
  {name: 'Sierra Nevada National Park', image: 'https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'}
];

/* get landing page */
app.get('/', (req, res) => {
  res.render('landing');
});

/* get campgrouds page */
app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {campgrounds: campgrounds});
});

/* post a new campground */
app.post('/campgrounds', (req, res) => {
  var newCampground = {name: req.body.name, image: req.body.image};
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

/* get form to create a new campground */
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

/* start the server */
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });