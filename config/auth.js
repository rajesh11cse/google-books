'use strict';
// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    // google login authentication
    'googleAuth': {
        'clientID': '563101676521-9qp0vduaqlcpog1s0orinb2n7mb3s4md.apps.googleusercontent.com', //'your-secret-clientID-here',
        'clientSecret': 'KrVsNMO8-5N0qlgd3ly_che2', //'your-client-secret-here',
        'callbackURL': 'http://localhost:3000/auth/google-books/',
        'profileFields': ['id', 'displayName', 'gender', 'emails', 'name', 'photos']
    }

}
