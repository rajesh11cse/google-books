/*
 * File :  config/passport.js
 */
'use strict';

// load all the things we need
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//User = require('../models/users'), // load up the user model
var configAuth = require('./auth');// load the auth variables from auth.js 

module.exports = function (passport) {

    // used to serialize the user for the session
    // passport.serializeUser(function (user, done) {
    //     done(null, user._id);
    // });

    // // used to deserialize the user
    // passport.deserializeUser(function (id, done) {
    //     User.findById(id, function (err, user) {
    //         done(err, user);
    //     });
    // });



    // =========================================================================
    // GOOGLE LOGIN ============================================================
    // =========================================================================

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
        // Use the GoogleStrategy within Passport.
        // Strategies in passport require a `verify` function, which accept
        // credentials (in this case, a token, tokenSecret, and Google profile), and
        // invoke a callback with a user object.
        function (token, tokenSecret, profile, done) {
            console.log('profile')
            // asynchronous
            process.nextTick(function () {
                console.log(profile)
                // if successful, return the new user
                return done(null, profile);
            });
        }
    )
    )
};