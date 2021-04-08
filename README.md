# homebridge-garagedoor-command
[![mit license](https://badgen.net/badge/license/MIT/red)](https://github.com/apexad/homebridge-mysmartblinds-bridge/blob/master/LICENSE)
[![npm](https://badgen.net/npm/v/homebridge-garagedoor-command)](https://www.npmjs.com/package/homebridge-garagedoor-command)
[![npm](https://badgen.net/npm/dt/homebridge-garagedoor-command)](https://www.npmjs.com/package/homebridge-garagedoor-command)
[![donate](https://badgen.net/badge/donate/paypal/91BE09)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JS2VTL89E6VZ4&source=url)

[Homebridge](https://github.com/homebridge/homebridge) plugin to control a garage door using command line functions  
It supports commands to check `state`, `open`, and `close` the garage door

## Configuration
This easiest way to use this plugin is to use [homebridge-config-ui-x](https://www.npmjs.com/package/homebridge-config-ui-x).  
To configure manually, add to the `accessories` section of Homebridge's `config.json` after installing the plugin as shown below:


```json
"accessories": [
  {
    "accessory": "GarageCommand",
    "name": "Garage Door",
    "open": "./open.sh",
    "close": "./close.sh",
    "state": "./check_state.sh",
    "status_update_delay": 15,
    "poll_state_delay": 20,
    "ignore_errors": false,
    "log_polling": false
  }
]

```

Field                   | Description
------------------------|------------
**accessory**           | Must always be "GarageCommand" (required)
**name**                | Name of the Garage Door (required)
**open**                | open command. Examples: `./open.sh` or `node open.js` (required)
**close**               | close command. Examples: `./close.sh` or `node close.js` (required)
**state**               | state command.  Examples: `./check_state.js` or `node state.js` (required)
**status_update_delay** | Time to have door in opening or closing state (defaults to 15 seconds)
**poll_state_delay**    | Time between polling for the garage door's state (leave blank or set to 0 to disable state polling)
**ignore_errors**       | Causes the plugin to replace 'STOPPED' status with 'CLOSED' (defaults to false)
**log_polling**         | Will log every single status check to the homebridge log (default to false)

* The open, close, and state commands must return the following verbs: OPEN, CLOSED, OPENING, CLOSING, STOPPED.

## Branding
The following config options can also be added manually or configured in [homebridge-config-ui-x](https://www.npmjs.com/package/homebridge-config-ui-x):

Field                   | Description
------------------------|------------
**manufacturer**        | Manufacturer to display instead of default 'Apexad'
**model**               | Model to display instead of default 'Garage Commmand'
**serialNum**           | Serial Number to display instead of default '001'


## FAQ
### Can I have multiple garage doors?
Yes! but this is a feature of homebridge, not the plugin.  
Add another accessory block with a different name than your other garage door.  
If using [homebridge-config-ui-x](https://www.npmjs.com/package/homebridge-config-ui-x) you can do this in the plugin settings.

### Can you add 'x' feature?
Yes, I probably could.  Will I?  Probably not.  It does not hurt to ask though but I will also gladly look at any PRs too.

### What is the STOPPED status?
STOPPED is a valid status for a door to be in, but in the Home App, it is reported as OPEN (with a slightly different icon). If an error occures in getting the status, STOPPED should be returned, and it will be logged, but the plugin has the `ignore_errors` config option so that a false OPEN event won't be triggered. Be careful with `ignore_errors` as it can be somewhat dangerous to report an error as CLOSED.

