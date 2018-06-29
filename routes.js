'use strict'

// routes.js

// load all the things we need
var path = require('path'),
  configAuth = require('./config/auth.js'),
  mongoose = require('mongoose');


var store = require('store')

require('./models/books.js');
var Books = mongoose.model('Books');

var appRouter = function (app, passport) {

  // Default API
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '', './index.html'));
  });

  app.get("/home/favorite-books", function (req, res) {
    res.sendFile(path.join(__dirname, '', 'home/favorite-books.html'));
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
      if (store.get('user')) {
        res.sendFile(path.join(__dirname, '', 'home/google-books.html'));
        return;
      }
      passport.authenticate('google', function (err, user, info) {
        if (err) { return next(err); }
        if (user) {
          store.set('user', { name: user })
          res.sendFile(path.join(__dirname, '', 'home/google-books.html'));
          return;
        }
      })(req, res, next);
    });

  app.get('/logout', function (req, res) {
    store.clearAll()
    req.logout();
    res.redirect('/');
  });

  app.route('/get_user')
    .get(function (req, res) {
      res.status(200).json({ 'result': 'Success', 'user': store.get('user') })
    });

  app.route("/books/add_to_favorite")
    .post(function (req, res) {
      var books = new Books(req.body);
      books.save(function (err, book) {
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
    });

  app.route("/books/get_favorites")
    .get(function (req, res) {
      Books.find(function (err, books) {
        if (err) {
          res.status(400).json({ 'result': 'Error', 'data': err })
        } else {
          res.status(200).json({ 'result': 'Success', 'data': books })
        }
      });
    });

  app.route("/books/remove_from_favorite")
    .post(function (req, res) {
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
    });
}
module.exports = appRouter;