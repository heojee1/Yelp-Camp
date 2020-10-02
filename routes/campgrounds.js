// ============================
// ==== CAMPGROUNDS Routes ====
// ============================

const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

/* INDEX - show all campgrouds */
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
      if(err) console.log(err);
      else res.render('campgrounds/index', {campgrounds: campgrounds});
    })
});

/* CREATE - add new campground to DB */
router.post('/', isLoggedIn, (req, res) => {
    var newCampground = req.body.campground;
    newCampground.author = {id: req.user._id, username: req.user.username};
    Campground.create(newCampground, (err, campground) => {
        if (err) console.log(err);
        else {
            res.redirect('/campgrounds');
        }
    });
});

/* NEW - show form to create new campground */
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

/* SHOW - show more information about a campground */
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) console.log(err);
        else res.render('campgrounds/show', {campground: foundCampground});
    });
});

/* EDIT - edit campground */
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

/* UPDATE - update campground */
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

/* DElETE - delete campground */
router.delete("/:id", checkCampgroundOwnership, async(req, res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        res.redirect(`/campgrounds`);
    } catch (error) {
        console.log(error.message);
        res.redirect("/campgrounds");
    }
});

/* check if the user is logged in */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

/* check if the user has authorization */
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.send('no authorization');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}


module.exports = router;