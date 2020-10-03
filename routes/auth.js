// =====================
// ==== AUTH Routes ====
// =====================
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* SHOW - show sign up form */
router.get('/register', (req, res) => {
    res.render('auth/register');
});

/* handle sign up request */
router.post('/register', isNotLoggedIn, (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('auth/register');
        }
        passport.authenticate('local')(req, res, () => {
        res.redirect('/campgrounds');
        });
    });
});
  
/* SHOW - show login form */
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});

/* handle login request */
router.post('/login', isNotLoggedIn, passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
});

/* handle logout request */
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('back');
});

/* check if the user is logged in */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/campgrounds');
}

/* check if the user is logged in */
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/campgrounds');
}

module.exports = router;