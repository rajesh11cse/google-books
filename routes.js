'use strict'

// routes.js

// load all the things we need
var path = require('path'),
  configAuth = require('./config/auth.js'),
  mongoose = require('mongoose');

require('./models/books.js');
var Books = mongoose.model('Books');

var appRouter = function (app, passport) {

  // Default API
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '', './index.html'));
  });

  app.get("/home/favorite-books", function (req, res) {
    if (!req.user) {// get user from session or deserialize
      res.redirect('/logout');
      return;
    } else {
      req.session.touch()// reinitialize ssession
      res.sendFile(path.join(__dirname, '', 'home/favorite-books.html'));
    }
  });

  // ============================= Set up the RESTful APIs ==================================

  // GET /auth/google/
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.route('/auth/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.route('/auth/google-books')
    .get(function (req, res, next) {
      if (req.user) {// get user from session or deserialize
        console.log('sdfsdfsaa')
        req.session.touch()// reinitialize ssession
        res.sendFile(path.join(__dirname, '', 'home/google-books.html'));
        return;
      } else {
        passport.authenticate('google', function (err, user, info) {
          if (err) {
            console.log('Error------------')
            console.log(err);
            req.session.destroy()
            req.logout();
            res.redirect('/');
            return next(err);
          }
          console.log('adfsafsafdsaf')
          if (user) {
            // set user on session or serialize
            req.logIn(user, function (err) {
              if (err) {
                return next(err);
              } else {
                console.log('serialized..')
              }
            });
            res.sendFile(path.join(__dirname, '', 'home/google-books.html'));
            return;
          }
        })(req, res, next);
      }
    });

  app.route('/logout')
    .get(function (req, res) {
      req.session.destroy()
      req.logout();
      res.redirect('/');
    });

  app.route('/get_user')
    .get(function (req, res) {
      res.status(200).json({ 'result': 'Success', 'user': req.user._json })
    });

  app.route("/books/add_to_favorite")
    .post(function (req, res) {
      if (!req.user) {// get user from session or deserialize
        res.redirect('/logout');
        return;
      } else {
        req.session.touch()// reinitialize ssession
        var books = new Books(req.body);
        books.save(function (err, book) {
          if (err) {
            console.log(err)
            // if error is occured, handle error
            res.status(400).json({ 'result': 'Error', 'data': err })
          } else {
            console.log('Success')
            Books.find(function (err, books) {
              if (err) {
                res.status(400).json({ 'result': 'Error', 'data': err })
              } else {
                res.status(200).json({ 'result': 'Success', 'data': books })
              }
            });
          }
        });
      }
    });

  app.route("/books/get_favorites")
    .get(function (req, res) {
      if (!req.user) {// get user from session or deserialize
        res.status(500).json({ 'result': 'session expired' })
        return;
      } else {
        req.session.touch()// reinitialize ssession
        Books.find(function (err, books) {
          if (err) {
            res.status(400).json({ 'result': 'Error', 'data': err })
          } else {
            res.cookie('cookieName', 'cookieValue')
            res.status(200).json({ 'result': 'Success', 'data': books })
          }
        });
      }
    });

  app.route("/books/remove_from_favorite")
    .post(function (req, res) {
      if (!req.user) {// get user from session or deserialize
        res.redirect('/logout');
        return;
      } else {
        req.session.touch()// reinitialize ssession
        Books.remove({ 'bookId': req.body.bookId }, function (err, data) {
          if (err) {
            // if error is occured, handle error
            res.status(400).json({ 'result': 'Error', 'data': err })
          } else {
            Books.find(function (err, books) {
              if (err) {
                res.status(400).json({ 'result': 'Error', 'data': err })
              } else {
                res.status(200).json({ 'result': 'Success', 'data': books })
              }
            });
          }
        });
      }
    });
}
module.exports = appRouter;