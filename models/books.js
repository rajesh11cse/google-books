'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Usrs Schema
 */

var BooksSchema = new Schema({
  
  bookId: {
    type: String
  },

  title: {
    type: String
  },
  
  author: {
    type: String
  },
  
  published_date: {
    type: String
  },
  
  publisher: {
    type: String
  },
  
  image_url: {
    type: String
  },
  

  createdAt: {
      type: Date,
      default:new Date()
  },

  updatedAt: {
      type: Date
  },

});


module.exports = mongoose.model('Books', BooksSchema);

BooksSchema.pre('save', function(next){
  var now = new Date();
  this.updateAt = now;
  if(!this.createdAt){
    this.createdAt = now;
  }
  next();
});
