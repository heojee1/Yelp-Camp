// =========================
// ==== COMMENTS Routes ====
// =========================

const express = require('express'),
      router = express.Router({mergeParams: true}),
      Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      middleware = require('../middleware/index');

/* NEW - show form to add new comment */
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) console.log(err);
        else res.render('comments/new', {campground: foundCampground});
    });
});

/* CREATE - add new comment to campground and DB */
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {comment: foundComment, campground_id: req.params.id});
        }
    })
});

/* UPDATE - update comments */
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

/* DELETE - delete comments */
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
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

module.exports = router;