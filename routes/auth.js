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

/* handle sing up request */
router.post('/register', (req, res) => {
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

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;