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
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },
  
  author: {
    type: String,
    required: true
  },
  
  published_date: {
    type: String,
    required: true
  },
  
  publisher: {
    type: String,
    required: true
  },
  
  image_url: {
    type: String,
    required: true
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
