const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('auth/login'));

// Register Page
router.get('/register', (req, res) => res.render('auth/register'));

// Register Handle
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    let user = await User.findOne({ username });
    if (user) {
      req.flash('error_msg', 'Username already exists');
      return res.redirect('/register');
    }

    user = new User({ username, password });
    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/todos',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error(err);
      return next(err); // Or handle the error appropriately
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});


module.exports = router;