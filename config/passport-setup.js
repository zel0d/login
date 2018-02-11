// Load all the strategies we need
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
// Load the user model
const User = require('../models/user-model');
// Load the keys
const keys = require('./keys')
// Require passport
const passport = require('passport');

// Used to serialize the user for the session
passport.serializeUser(function(user, done){
  done(null, user.id);
});

// Used to deserialize the user
passport.deserializeUser(function(id, done){
  User.findById(id).then(function(user){
    done(null, user);
  });
});

// Twitter strategy
passport.use(
  new TwitterStrategy({
    callbackURL: '/auth/twitter/redirect',
    consumerKey: keys.twitter.consumerKey,
    consumerSecret: keys.twitter.consumerSecret
  }, function(accessToken, refreshToken, profile, done){
    // Check if the user is already in our db
    User.findOne({ 'twitter.id': profile.id}).then(function(currentUser){
      //console.log(profile);
      if(currentUser){
        // If it's a existing user
        //console.log('Existing user: ' + currentUser);
        User.updateOne(currentUser, { 'twitter.thumbnail': profile._json.profile_image_url})
        done(null, currentUser);
      } else {
        // If it's a new user
        new User({
          'local.thumbnail' : profile._json.profile_image_url,

          'twitter.username': profile.username,
          'twitter.id': profile.id,
          'twitter.thumbnail': profile._json.profile_image_url,
        }).save().then(function(newUser){
          console.log('New user created: ' + newUser.twitter.username);
          done(null, newUser);
        });
      }
    })
  })
);

// Facebook strategy
passport.use(
  new FacebookStrategy({
    callbackURL: '/auth/facebook/redirect',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret
  }, function(accessToken, refreshToken, profile, done){
    // Check if the user is already in our db
    User.findOne({ 'facebook.id': profile.id}).then(function(currentUser){
      console.log(profile);
      //console.log(profile);
      if(currentUser){
        // If it's a existing user
        User.updateOne(currentUser, {'facebook.thumbnail': 'https://graph.facebook.com/' + profile.id + '/picture'})
        done(null, currentUser);
      } else {
        // If it's a new user
        new User({
          'local.firstName'   : profile.name.givenName,
          'local.lastName'    : profile.name.familyName,
          'local.gender'      : profile.gender,
          'local.thumbnail'   : 'https://graph.facebook.com/' + profile.id + '/picture',

          'facebook.username' : profile.displayName,
          'facebook.id'       : profile.id,
          'facebook.token'    : accessToken,
          'facebook.thumbnail': 'https://graph.facebook.com/' + profile.id + '/picture',
        }).save().then(function(newUser){
          console.log('New user created: ' + newUser.facebook.username);
          done(null, newUser);
        });
      }
    })
  })
);

// Google strategy
passport.use(
  new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, function(accessToken, refreshToken, profile, done){
    // Check if the user is already in our db
    User.findOne({'google.id': profile.id}).then(function(currentUser){
      console.log(profile);
      if(currentUser){
        // If it's a existing user
        //console.log('Existing user: ' + currentUser);
        User.updateOne(currentUser, {'google.thumbnail': profile._json.image.url})
        done(null, currentUser);
      } else {
        // If it's a new user
        new User({
          'local.firstName' : profile.name.givenName,
          'local.lastName'  : profile.name.familyName,
          'local.gender'    : profile.gender,
          'local.thumbnail' : profile._json.image.url,

          'google.username' : profile.displayName,
          'google.id'       : profile.id,
          'google.thumbnail': profile._json.image.url
        }).save().then(function(newUser){
          console.log('New user created: ' + newUser.google.username);
          done(null, newUser);
        });
      }
    })
  })
);

// Local login strategy
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    User.findOne({ 'local.username': username.toLowerCase() }, function(err, user) {
      // If there is an error, return the error
      if (err) {
        return done(err);
      }
      // If no user is found in the database, return the message
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'User Not found.') );
      }
      // If the password is wrong, return the message
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Invalid Password') );
      }
      // All is well, so return the user
      return done(null, user);
    });
  }
));

// Local signup strategy
passport.use('signup', new LocalStrategy({
  passReqToCallback: true,
  },
  function(req, username, password, done) {
    User.findOne({ 'local.username': username.toLowerCase() }, function(err, user) {
      // If there is an error, return the error
      if (err) {
        return done(err);
      }
      // If there is already this username in the database, return the message
      if (user) {
        return done(null, false, { message: 'This username is already taken.' });
      }
      // All is well, so it's a new user
      new User({
        'local.username'  : username,
        'local.password'  : generateHash(password),
        // 'local.firstName' : req.body.firstname,
        // 'local.lastName'  : req.body.last-name,
      }).save().then(function(newUser){
          console.log('New user created: ' + newUser.local.username);
          done(null, newUser);
        });
    });
  }
));
