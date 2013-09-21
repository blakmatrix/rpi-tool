//disk.js

var    path = require('path'),
        rpi = require(path.join('..', '..', 'rpi-tool')),
      utile = require('utile'),
      exec  = require('child_process').exec,
      spawn = require('child_process').spawn,
         fs = require('fs');

var disk = exports;

disk.usage = [
  'The `rpi-tool disk` command manages',
  'disk operations. Valid commands are:',
  '',
  'rpi disk unmount <disk>',
  'rpi disk format  <disk>',
  'rpi disk copy    <dir> <disk>',
  '',
  'For commands that take a <name> parameter, if no parameter',
  'is supplied, rpi will prompt you for further instructions.'
];

disk.unmount = function (pDisk, callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    pDisk      = args[0] || '';
  }

  rpi.log.info('Unmounting "'  + pDisk.magenta + '" ...');

  if(process.platform === 'darwin'){

    //runCommand('diskutil unmountDisk '+pDisk,callback);
    spawnCommand('diskutil', ['unmountDisk', pDisk], callback);
  }
  else{
    rpi.log.warn('Unmounting procedure not supported for '  + (process.platform).magenta);
    callback(null);
  }


};

disk.unmount.usage = [
  '',
  'Unmounts the given disk'.cyan.underline,
  '',
  'rpi-tool unmount',
  'rpi-tool disk unmount'
];

disk.list = function (callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
  }

  rpi.log.info('Getting disk listings...');

  if(process.platform === 'darwin'){
    spawnCommand('diskutil', ['list'], callback);
  }
  else{
    rpi.log.warn('Listing procedure not supported for '  + (process.platform).magenta);
    callback(null);
  }


};

disk.list.usage = [
  '',
  'Unmounts the given disk'.cyan.underline,
  '',
  'rpi-tool disk list'
];

disk.format = function (pDisk, callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    pDisk      = args[0] || '';
  }

  rpi.log.info('Formating "'  + pDisk.magenta + '" ...');

  if(process.platform === 'darwin'){

    //runCommand('diskutil eraseDisk FAT32 NOOBS MBRFormat '+pDisk, callback);
    spawnCommand('diskutil', ['eraseDisk', 'FAT32', 'NOOBS', 'MBRFormat', pDisk], function(code){
      //rpi.log.info('Process exited with code ' + code);
      callback(null);
    });
  }
  else{
    rpi.log.warn('Formating procedure not supported for '  + (process.platform).magenta);
    callback(null);
  }


};

disk.format.usage = [
  '',
  'Formats the given disk'.cyan.underline,
  '',
  'rpi-tool format',
  'rpi-tool disk format'
];

disk.copy = function (dir, pDisk, callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    dir        = args[0] || '';
    pDisk      = args[1] || '';
  }

  rpi.log.info('Copying "'  + dir + '" to "'+ pDisk.magenta + '" ...');

  if(process.platform === 'darwin'){

    runCommand('cp -R'+ dir + '/* ' + pDisk, callback);
  }
  else{
    rpi.log.warn('Copying procedure not supported for '  + (process.platform).magenta);
    callback(null);
  }


};

disk.copy.usage = [
  '',
  'Copys the given directory to the given disk'.cyan.underline,
  '',
  'rpi-tool copy',
  'rpi-tool disk copy'
];

function runCommand(cmd, cb) {
  var child;
  rpi.log.debug('calling: "' + cmd.grey + '"');
  child = exec(cmd,
    function (error, stdout, stderr) {
      console.dir(error);
      console.dir(stdout);
      console.dir(stderr);
      if (error !== null) {
        rpi.log.warn('runCommand: `' + cmd.grey + '`' + ' ERROR DETECTED!'.red.bold);
        return cb(null);

      } else {
        rpi.log.info('runCommand: `' + cmd.grey + '"' + 'SUCCESFUL!'.green.bold);
        return cb(null);
      }
    });
}

function spawnCommand(cmd, args, cb) {
  var child;
  //rpi.log.debug('calling: "' + cmd.grey + '"');
  child = spawn(cmd, args);
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    if (/^execvp\(\)/.test(data)) {
      rpi.log.error('Failed to start child process.');
    }
  });
  child.stdout.on('data', function (data) {
    data.toString()
        .split('\n')
        .filter(function(e){return e !=='';})
        .forEach(function(line){
          rpi.log.info('' + line.toString().replace(/\n$/, ''));
        });
  });

  child.on('close', function (code) {
    return cb(null, code);
  });
}