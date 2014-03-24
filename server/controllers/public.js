'use strict';

/**
 * Publicly accessible api endpoint. This is handy at times for things that don't require authentication (like user profile picture, etc.).
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    config = require('../config/config');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/users/:id/picture', getPicture));
};

function *getPicture(id) {
  id = parseInt(id);
  var user = yield mongo.users.findOne({_id: id}, {picture: 1});
  if (user) {
    var img = new Buffer(user.picture, 'base64');
    this.set('Content-Type', 'image/jpeg');
    if (config.app.env === 'production') {
      this.set('Cache-Control', 'max-age=' + (60 * 60 * 24 * 7 /* 7 days */));
    }
    this.body = img;
  }
}