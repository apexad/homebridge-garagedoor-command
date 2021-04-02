var Service;
var Characteristic;
var exec = require('child_process').exec;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-garagedoor-command', 'GarageCommand', GarageCmdAccessory);
};

function GarageCmdAccessory(log, config) {
  this.log = log;
  this.name = config.name;
  this.openCommand = config.open;
  this.closeCommand = config.close;
  this.stateCommand = config.state;
  this.statusUpdateDelay = config.status_update_delay || 15;
  this.pollStateDelay = config.poll_state_delay || 0;
  this.ignoreErrors = config.ignore_errors || false;
  this.logPolling = config.log_polling || false;
}

GarageCmdAccessory.prototype.setState = function(isClosed, callback, context) {
  if (context === 'pollState') {
    // The state has been updated by the pollState command - don't run the open/close command
    callback(null);
    return;
  }

  var accessory = this;
  var state = isClosed ? 'close' : 'open';
  var prop = state + 'Command';
  var command = accessory[prop];
  accessory.log('Commnand to run: ' + command);

  exec(
    command,
    {
      encoding: 'utf8',
      timeout: 10000,
      maxBuffer: 200*1024,
      killSignal: 'SIGTERM',
      cwd: null,
      env: null
    },
    function (err, stdout, stderr) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + state));
      } else {
        accessory.log('Set ' + accessory.name + ' to ' + state);
        if (stdout.indexOf('OPENING') > -1) {
          accessory.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPENING);
          setTimeout(
            function() {
              accessory.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPEN);
            },
            accessory.statusUpdateDelay * 1000
          );
        } else if (stdout.indexOf('CLOSING') > -1) {
          accessory.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSING);
          setTimeout(
            function() {
              accessory.garageDoorService.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
            },
            accessory.statusUpdateDelay * 1000
          );
        }
       callback(null);
     }
  });
};

GarageCmdAccessory.prototype.pollState = function() {
  var accessory = this;

  if (accessory.stateTimer) {
    clearTimeout(accessory.stateTimer);
    accessory.stateTimer = null;
  }

  var command = accessory.stateCommand;

  exec(command, function (err, stdout, stderr) {
    var state = stdout.toString('utf-8').trim();
    var doorState = Characteristic.CurrentDoorState[state] || Characteristic.CurrentDoorState.STOPPED;

    if (doorState === Characteristic.CurrentDoorState.STOPPED && accessory.ignoreErrors) {
      doorState = Characteristic.CurrentDoorState.CLOSED;
    } else {
      accessory.log('Error: ' + err);
    }

    accessory.getCharacteristic(Characteristic.CurrentDoorState).setValue(doorState);
    accessory.getCharacteristic(Characteristic.TargetDoorState).setValue(doorState);
  });

  accessory.stateTimer = setTimeout(accessory.pollSate(), accessory.pollStateDelay * 1000);
}

GarageCmdAccessory.prototype.getServices = function() {
  this.informationService = new Service.AccessoryInformation()
    .setCharacteristic(Characteristic.Manufacturer, 'Apexad')
    .setCharacteristic(Characteristic.Model, 'Garage-Command')
    .setCharacteristic(Characteristic.SerialNumber, '1');
  this.garageDoorService = new Service.GarageDoorOpener(this.name);

  this.garageDoorService.getCharacteristic(Characteristic.TargetDoorState)
    .on('set', this.setState.bind(this));

  if (this.stateCommand) { this.pollState(); }

  return [this.informationService, this.garageDoorService];
};
