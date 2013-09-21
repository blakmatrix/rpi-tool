/*
 * usage.js: Text for `rpi-tool help`.
 */

var colors = require('colors');

module.exports = [
  ' ______________'.cyan,
  ' |            |'.cyan,
  ' |  RPI-TOOL  |'.cyan,
  ' |____________|'.cyan,
  '',

  'A Tool for downloading and installing images to',
  'SD cards for use with the RaspberryPi.',
  '',

  'Usage:'.cyan.bold.underline,
  '',
  '  rpi-tool [<resource>] <action> <param1> <param2> ...',
  '',


  'Lists all images currently available locally'.cyan,
  '  rpi-tool list',
  '',

  'Runs the installation suite'.cyan,
  '  rpi-tool install',
  '',

  'Downloads a direct download or torent of a image'.cyan,
  '  rpi-tool get [link]',
  '',

  'Writes an image to an SD card'.cyan,
  '  rpi-tool write [image]',
  ''
];