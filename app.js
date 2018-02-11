// Modules
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false});
const session           = require('express-session');
const passport          = require('passport');
const passportSetup     = require('./config/passport-setup');
const mongoose          = require('mongoose');
const flash             = require('connect-flash');
const keys              = require('./config/keys');


// Routes
const indexRoutes = require('./routes/index-routes.js');
const authRoutes = require('./routes/auth-routes.js');
const profileRoutes = require('./routes/profile-routes.js');

// Connect to the db
mongoose.connect(keys.mongodb.dbURI, function(){
  console.log('Connected to the database');
})

// Initialize passport
app.use(session({
  secret: keys.session.cookieKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: null,
  }}));
app.use(passport.initialize());
app.use(passport.session());

// Setup flash messages
app.use(flash());

// Setup the view engine
app.set('view engine', 'ejs');

// Serving static files
app.use(express.static('public'));

// Setup routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Launch
app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
