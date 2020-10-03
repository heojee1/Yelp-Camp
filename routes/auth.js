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

/* handle logout request */
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('back');
});

module.exports = router;