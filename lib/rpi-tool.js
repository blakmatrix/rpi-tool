var path = require('path'),
    util = require('util'),
    colors = require('colors'),
    flatiron = require('flatiron');

var rpi = module.exports = flatiron.app;

//
// Setup `rpi` to use `pkginfo` to expose version
//
require('pkginfo')(module, 'name', 'version');

//
// Configure rpi to use `flatiron.plugins.cli`
//
rpi.use(flatiron.plugins.cli, {
  version: true,
  usage: require('./rpi/usage'),
  source: path.join(__dirname, 'rpi', 'commands'),
  argv: {
    version: {
      alias: 'v',
      description: 'print rpi version and exit',
      string: true
    },
    colors: {
      description: '--no-colors will disable output coloring',
      default: true,
      boolean: true
    },
    confirm: {
      alias: 'c',
      description: 'prevents rpi from asking before overwriting/removing things',
      default: false,
      boolean: true
    },
    raw: {
      description: 'rpi will only output line-delimited raw JSON (useful for piping)',
      boolean: true
    }
  }
});

rpi.options.log = {
  console: {
    raw: rpi.argv.raw
  }
};

//
// Setup config, users, command aliases and prompt settings
//
rpi.prompt.properties = flatiron.common.mixin(
  rpi.prompt.properties,
  require('./rpi/properties')
);
rpi.prompt.override   = rpi.argv;
require('./rpi/alias');

//
// Setup other rpi settings.
//
rpi.common   = require('./rpi/common');
rpi.started  = false;




rpi.welcome = function () {
  rpi.log.info('Welcome to ' + 'rpi-tool'.grey);
  rpi.log.info('rpi-tool v' + rpi.version + ', node ' + process.version);
  rpi.log.info('It worked if it ends with ' + 'rpi-tool'.grey + ' ok'.green.bold);
};


rpi.start = function (callback) {

  var useColors = (typeof rpi.argv.colors == 'undefined' || rpi.argv.colors);

  useColors || (colors.mode = "none");

  rpi.init(function (err) {
    if (err) {
      rpi.welcome();
      callback(err);
      return rpi.showError(rpi.argv._.join(' '), err);
    }

    if ( !rpi.config.get('colors') || !useColors ) {
      colors.mode = "none";
      rpi.log.get('default').stripColors = true;
      rpi.log.get('default').transports.console.colorize = false;
    }

    rpi.welcome();
    return rpi.exec(rpi.argv._, callback);
  });

};


rpi.exec = function (command, callback) {
  function execCommand (err) {
    if (err) {
      return callback(err);
    }


    rpi.log.info('Executing command ' + command.join(' ').magenta);
    rpi.router.dispatch('on', command.join(' '), rpi.log, function (err, shallow) {
      if (err) {
        callback(err);
        return rpi.showError(command.join(' '), err, shallow);
      }

      callback();
    });
  }

  return !rpi.started ? rpi.setup(execCommand) : execCommand();
};


rpi.setup = function (callback) {
  if (rpi.started === true) {
    return callback();
  }

  rpi.started = true;
  callback();
};


rpi.showError = function (command, err, shallow, skip) {
  var username,
      stack;

  rpi.log.error('Error running command ' + command.magenta);

  err.stack.split('\n').forEach(function (trace) {
    rpi.log.error(trace);
  });


  rpi.log.info('rpi-tool '.grey + 'not ok'.red.bold);
};