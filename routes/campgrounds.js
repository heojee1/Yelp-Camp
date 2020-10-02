// ============================
// ==== CAMPGROUNDS Routes ====
// ============================

const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

/* INDEX - show all campgrouds */
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
      if(err) console.log(err);
      else res.render('campgrounds/index', {campgrounds: campgrounds});
    })
});

/* CREATE - add new campground to DB */
router.post('/', (req, res) => {
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
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

/* SHOW - show more information about a campground */
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) console.log(err);
        else res.render('campgrounds/show', {campground: foundCampground});
    });
});

module.exports = router;