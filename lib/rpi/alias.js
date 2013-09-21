
var path = require('path'),
     rpi = require(path.join('..','rpi-tool'));

//
// Alias the imageropriate commands for simplier CLI usage
//
rpi.alias('i',        { resource: 'image',   command: 'install' });
rpi.alias('start',    { resource: 'image',   command: 'install' });
rpi.alias('install',  { resource: 'image',   command: 'install' });
rpi.alias('g',        { resource: 'image',   command: 'get' });
rpi.alias('get',      { resource: 'image',   command: 'get' });
rpi.alias('download', { resource: 'image',   command: 'get' });
rpi.alias('w',        { resource: 'image',   command: 'write' });
rpi.alias('write',    { resource: 'image',   command: 'write' });
rpi.alias('ls',       { resource: 'images',  command: 'list' });
rpi.alias('l',        { resource: 'images',  command: 'list' });
rpi.alias('list',     { resource: 'images',  command: 'list' });
rpi.alias('unmount',  { resource: 'disk',    command: 'unmount' });
rpi.alias('format',   { resource: 'disk',    command: 'format' });
rpi.alias('copy',     { resource: 'disk',    command: 'copy' });