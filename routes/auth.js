// =====================
// ==== AUTH Routes ====
// =====================
const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user');

/* SHOW - show sign up form */
router.get('/register', (req, res) => {
    res.render('auth/register');
});

/* handle sign up request */
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to YelpCamp ${user.username}`);
            res.redirect('/campgrounds');
        });
    });
});
  
/* SHOW - show login form */
router.get('/login', (req, res) => {
    res.render('auth/login');
});

/* handle login request */
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
});

/* handle logout request */
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('back');
});

module.exports = router;