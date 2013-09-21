/*
 * images.js: Commands related to user resources
 *
 * (C) 2010, Noderpi Inc.
 *
 */

var   path = require('path'),
        fs = require('fs'),
       rpi = require(path.join('..', '..', 'rpi-tool')),
    mkdirp = require('mkdirp'),
     utile = require('utile');

var images = exports;

images.usage = [
  'The `rpi-tool images` command manages',
  'images . Valid commands are:',
  '',
  'rpi-tool images list',
  'rpi-tool images destroy [<image>]',
  'rpi-tool images get [<link>] ',
  'rpi-tool images clearall',
  '',
  'For commands that take a <name> parameter, if no parameter',
  'is supplied, rpi-tool will prompt you for further instructions.'
];


images.list = function (callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
  }

  rpi.log.info('Listing all local images: ');
  mkdirp(path.join(getUserHome(),'.rpi-tool'), function (err) {
    if (err){ return callback(err);}
    //console.log(path.resolve(path.join(getUserHome(),'.rpi-tool')));
    var files = fs.readdir(path.resolve(path.join(getUserHome(),'.rpi-tool')), function(err, files){
      if(files.length === 0){rpi.log.info("No files exist yet!");}
      files.forEach(function(file){
        rpi.log.info(file);
      });
      return callback(null);
    });
  });
};

//
// Usage for `rpi-tool images list`.
//
images.list.usage = [
  '',
  'Lists all images stored locally'.cyan.underline,

  '',
  'rpi-tool list',
  'rpi-tool images list'
];


images.destroy = function (imgName, callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    imgName    = args[0];
  }
  var filepath = path.resolve(path.join(getUserHome(),'.rpi-tool', imgName));
  fs.exists(filepath, function (exists) {
    if(!exists){
      rpi.log.warn(filepath.magenta + " does not exist!");
      return callback(null);
    }
    fs.unlink(filepath, function (err) {
      if (err){
        console.dir(err);
        return callback(err);
      }
      rpi.log.info('Successfully deleted '+filepath.magenta);
      return callback(null);
    });
  });
};

//
// Usage for `rpi-tool images list`.
//
images.destroy.usage = [
  '',
  'Destroys an image stored locally'.cyan.underline,

  '',
  'rpi-tool destroy',
  'rpi-tool images destroy'
];

images.get = function (link, callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    link       = args[0];
  }
  rpi.commands.get(link, callback);  
};

//
// Usage for `rpi-tool images list`.
//
images.get.usage = [
  '',
  'Retrieves an image using the following steps:'.cyan.underline,
  '',
  '  1. Downloads provided link, if download is a torrent',
  '     app will download it via that method. If no link is',
  '     provided app will enter into an interactive prompt.',
  '  2. Saves image to local for easy retrieval later',
  '',
  'rpi-tool g',
  'rpi-tool get',
  'rpi-tool download',
  'rpi-tool image get',
  'rpi-tool images get'
];

images.clearall = function (callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
  }

  rpi.log.info('Clearing all local images...');
  mkdirp(path.join(getUserHome(),'.rpi-tool'), function (err) {
    if (err){ return callback(err);}
    //console.log(path.resolve(path.join(getUserHome(),'.rpi-tool')));
    var files = fs.readdir(path.resolve(path.join(getUserHome(),'.rpi-tool')), function(err, files){
      if(files.length === 0){
        rpi.log.info("No files to remove");
        return callback(null);
      }
      files.forEach(function(file){
        fs.unlink(path.resolve(path.join(getUserHome(),'.rpi-tool', file)), function (err) {
          if (err) return callback(err);
          rpi.log.info('Successfully deleted '+path.resolve(path.join(getUserHome(),'.rpi-tool', file)).toString().magenta);
          return callback(null);
        });
      });
      return callback(null);
    });
  });
};

//
// Usage for `rpi-tool images list`.
//
images.clearall.usage = [
  '',
  'Clears all images stored locally'.cyan.underline,

  '',
  'rpi-tool clearall',
  'rpi-tool images clearall'
];

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}