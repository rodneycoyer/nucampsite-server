const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// local strategy authentication
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// serialize user for local session storage
passport.serializeUser(User.serializeUser());
// deserialize user
passport.deserializeUser(User.deserializeUser());