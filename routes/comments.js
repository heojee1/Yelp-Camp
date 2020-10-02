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
router.post('/', isLoggedIn, (req, res) => {
    const newComment = req.body.comment;
    newComment.author = {id: req.user._id, username: req.user.username};
    Comment.create(newComment, (err, comment) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Campground.findById(req.params.id, (err, foundCampground) => {
                if (err) console.log(err);
                else {
                    // associate comment with campground
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            });
        }
    });
});

/* check if the user is logged in */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


module.exports = router;