const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');

var campgrounds = [
  {name: 'Mount Cook National Park', image: 'https://images.unsplash.com/photo-1511993807578-701168605ad3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
  {name: 'Loch Lomond & The Trossachs', image: 'https://images.unsplash.com/photo-1488790881751-9068aa742b9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
  {name: 'Sierra Nevada National Park', image: 'https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'},
];

/* landing page */
app.get('/', (req, res) => {
  res.render('landing');
});

/* campgrouds page */
app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {campgrounds: campgrounds});
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
  });