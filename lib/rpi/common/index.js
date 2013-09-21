
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    flatiron = require('flatiron'),
    dateformat = require('dateformat'),
    async = flatiron.common.async,
    request = require('request'),
    rpi = require(path.join('..', '..', 'rpi-tool'));

var common = module.exports = flatiron.common.clone(flatiron.common);


common.checkVersion = function (callback) {
  //TODO
  return callback(null);
};