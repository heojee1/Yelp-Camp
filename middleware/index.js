const Campground = require('../models/campground'),
      Comment = require('../models/comment');

let middlewareObj = {};

/* check if the user is logged in */
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first');
    res.redirect('/login');
}

/* check if the user has authorization to the campground */
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You have no authorization');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'Please login first');
        res.redirect('back');
    }
}

/* check if the user has authorization to the comment */
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || foundComment) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You have no authorization');
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'Please login first');
        res.redirect('back');
    }
}

module.exports = middlewareObj;