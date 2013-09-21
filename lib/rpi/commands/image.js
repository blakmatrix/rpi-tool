//image.js

var    path = require('path'),
        rpi = require(path.join('..', '..', 'rpi-tool')),
      utile = require('utile'),
         fs = require('fs'),
        url = require('url'),
    ProgressBar = require('progress'),
    reader = require ("buffered-reader"),
    DataReader = reader.DataReader,
    request = require('request');


var image = exports;

image.usage = [
  'The `rpi-tool image` command manages',
  'raspberrypi image operations. Valid commands are:',
  '',
  'rpi image get     [<link>]',
  'rpi image write   [<image>] [<disk>]',
  'rpi image install [<link/image>] [<disk>]',
  '',
  'For commands that take a <name> parameter, if no parameter',
  'is supplied, rpi will prompt you for further instructions.'
];




image.get = function (link, callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    link   = args[0] || '';
  }

  rpi.log.info('Downloading '  + link.magenta);

  request.get(link)
  .on('error', callback)
  .on('response', function (res) {
    if (res.statusCode === 404) {
      return callback(new Error('No such file'));
    }
    else if (res.statusCode !== 200) {
      return callback(new Error('Unknown status code: ' + res.statusCode));
    }
    if (!rpi.config.get('raw') && process.stdout.isTTY ) {
      var bar = new ProgressBar('info'.green +':\t'+ ' Downloading: [:bar] :percent time: :elapseds eta: :etas',{
        total: parseInt(res.headers['content-length'], 10),
        width: 30,
        complete: '=',
        incomplete: ' '
      });

      res.on('data', function (chunk) {
        bar.tick(chunk.length);
      });

      res.on('end', function () {
        // fix for bar that sometimes hangs at 99%
        if (bar) {
          bar.tick(bar.total - bar.curr);
        }

        console.log('\n');
      });
    }
    var filename = url.parse(link).pathname.split('/').pop();
    var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    var filePath = path.resolve(path.join(home,'.rpi-tool', filename));
    console.log(filePath);
    res.pipe(fs.createWriteStream(filePath)).on('close', function () {
      rpi.log.info('Saved to file ' + filePath + '.');
      return callback(null);
    });
  });
};

image.get.usage = [
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
  'rpi-tool image get'
];

// TODO: consider using libguestfs
image.write = function (img, disk, callback) {
  if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    img    = args[0] || '';
    disk   = args[1] || '';
  }
  
  if (process.getuid() !== 0){ 
  //  NOTE: perhaps prompt for password then spawn a delayed sudo command such that
  //        we can send the password trough stdin to sudo, will need a delay
    rpi.log.error('This command must be run with root privlages, try running the following command:');
    rpi.log.error('sudo rpi-tool image write '+img+' '+disk+'');
    return callback(null);
  }
  //Default buffer if not specified is 16KB. 
  var bufferSize = 1024*1024;

  rpi.log.info('Writing ' + img.grey + ' for ' + disk.magenta);
  var imgSize =fs.statSync(img).size;
  // make sure 'disk' is unmounted before we write to it
  rpi.commands.unmount(disk, function(err){
    if(err){return callback(err);}

    var fd = fs.openSync(disk, "w");

    var bar = new ProgressBar('info'.green +':\t'+ ' Writing: [:bar] :percent time: :elapseds eta: :etas',{
      total: parseInt(imgSize, 10),
      width: 30,
      complete: '=',
      incomplete: ' '
    });

    var dr = new DataReader (img, { highWaterMark: bufferSize, bufferSize: bufferSize, encoding: null })
        .on ("error", function (error){
            callback(error);
        })
        .on ("buffer", function (buffer, nextByteOffset){
          // requires root privlages
          fs.write(fd, buffer, 0, buffer.length, null, function(err, written, buffer){
            if(err){callback(err);}

            bar.tick(buffer.length);

            if(nextByteOffset < 0){
              fs.fsync(fd, function(){
                fs.close(fd, function(){
                  bar = null;
                  //console.log("File is closed!");
                });
              })
              
            }
          });
        })
        .on ("end", function (){
          
          //if (bar) {
            //bar.tick(bar.total - bar.curr);

          //}
          rpi.log.info('');
          rpi.log.info('Image successfully written, you may now use your SD card\n');
          return callback(null);
        })
        .read ();
  //
  }); 
};

image.write.usage = [
  '',
  'Writes an image to disk'.cyan.underline,

  '',
  'rpi-tool w',
  'rpi-tool write',
  'rpi-tool image write'
];

image.install = function (link, disk, callback) {
   if(arguments.length) {
    var args   = utile.args(arguments);
    callback   = args.callback;
    link   = args[0] || '';// or img
    disk   = args[1] || '';
  }

    rpi.log.info('Installing ' +  link.magenta + ' on disk ' + disk.blue);
    return callback(null);

};

image.install.usage = [
  '',
  'Retrieves an image and writes it to disk using the following steps:'.cyan.underline,
  '',
  '  1. Enters interactive prompt to select an image to use',
  '     (will download if necessary and save it for usage later)',
  '  2. Attempts to find SD card',
  '  3. Writes image to SD card',
  '',
  'rpi-tool i',
  'rpi-tool install',
  'rpi-tool start',
  'rpi-tool image install'
];