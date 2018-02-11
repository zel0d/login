const router = require('express').Router();
const passport = require('passport');
const authCheck = require('../modules/auth-check').authCheck;
const unauthCheck = require('../modules/auth-check').unauthCheck;

router.get('/signup', unauthCheck, function (req, res) {
  res.render('signup', { message: req.flash('signupMessage') });
})

router.get('/login', unauthCheck, function (req, res) {
  res.render('login', { message: req.flash('loginMessage') });
})

router.get('/logout', function (req, res) {
  console.log('User ' + req.user.google.username + req.user.facebook.username + ' logs out');
  req.logout();
  res.redirect('/auth/login');
})

router.get('/logout/ask', authCheck, function (req, res) {
  res.render('logout-ask');
})

// Local strategy
router.post('/login', passport.authenticate('login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}), function(req, res){
  console.log(req.body);
});

router.post('/signup', passport.authenticate('signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}), function(req, res){
  console.log(req.body);
});

// Twitter strategy
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/redirect', passport.authenticate('twitter'), function(req, res){
  console.log('User ' + req.user.twitter.username + ' logs in');
  res.redirect('/');
})

// Facebook strategy
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/redirect', passport.authenticate('facebook'), function(req, res){
  console.log('User ' + req.user.facebook.username + ' login');
  res.redirect('/');
})

// Google strategy
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));
router.get('/google/redirect', passport.authenticate('google'), function(req, res){
  console.log('User ' + req.user.google.username + ' login');
  res.redirect('/');
})

module.exports = router;
