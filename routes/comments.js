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

/* EDIT - edit comments */
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {comment: foundComment, campground_id: req.params.id});
        }
    })
});

/* UPDATE - update comments */
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

/* DElETE - delete comments */
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            Campground.findById(req.params.id, (err, foundCampground) => {
                if (err) res.redirect('back');
                else {
                    foundCampground.comments.remove(req.params.comment_id);
                    foundCampground.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            })
        }
    })
});

/* check if the user is logged in */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

/* check if the user has authorization to the comment */
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
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