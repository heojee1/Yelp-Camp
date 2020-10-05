// ============================
// ==== CAMPGROUNDS Routes ====
// ============================

const express = require('express'),
      router = express.Router(),
      Campground = require('../models/campground'),
      middleware = require('../middleware'),
      NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

/* INDEX - show all campgrouds */
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
      if(err) console.log(err);
      else res.render('campgrounds/index', {campgrounds: campgrounds});
    })
});

/* CREATE - add new campground to DB */
router.post('/', middleware.isLoggedIn, (req, res) => {
    var newCampground = req.body.campground;
    newCampground.author = {id: req.user._id, username: req.user.username};
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          console.log(err);
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        newCampground.location = location;
        newCampground.lat = lat;
        newCampground.lng = lng;
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                res.redirect("/campgrounds");
            }
        });
      });
});

/* NEW - show form to create new campground */
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

/* SHOW - show more information about a campground */
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            req.flash('error', 'Something went wrong');
        } else res.render('campgrounds/show', {campground: foundCampground});
    });
});

/* EDIT - edit campground */
router.get('/:id/edit', middleware.isLoggedIn, middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

/* UPDATE - update campground */
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });

/* DElETE - delete campground */
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        req.flash('success', 'Campground deleted');
        res.redirect(`/campgrounds`);
    } catch (error) {
        req.flash('error', 'Something went wrong');
        res.redirect("/campgrounds");
    }
});

module.exports = router;