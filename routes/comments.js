// =========================
// ==== COMMENTS Routes ====
// =========================

const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

/* NEW - show form to add new comment */
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else res.render('comments/new', {campground: foundCampground});
  });
});

/* CREATE - add new comment to campground and DB */
router.post('', isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


module.exports = router;