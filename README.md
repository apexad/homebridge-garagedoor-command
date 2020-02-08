# homebridge-garagedoor-command
[Homebridge](https://github.com/nfarina/homebridge) plugin that supports triggering commands to check state, open, and close a garage door.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-garagedoor-command`
3. Update your configuration file. See the sample below.

## Configuration

Configuration sample:

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
    "debug": true
  }
]

```
## Explanation:

Field                   | Description
------------------------|------------
**accessory**           | Must always be "GarageCommand". (required)
**name**                | Name of the Garage Door
**open**                | open command. Examples: `./open.sh` or `node open.js` (required)
**close**               | close command. Examples: `./close.sh` or `node close.js` (required)
**state**               | state command.  Examples: `./check_state.js` or `node state.js` (required)
**status_update_delay** | Time to have door in opening or closing state (defaults to 15 seconds)
**poll_state_delay**    | Time between polling for the garage door's state (leave blank to disable state polling)
**ignore_errors**       | Causes the plugin to replace 'STOPPED' status with 'CLOSED'
**debug**               | Will write out every single status to the homebridge log

The open, close, and state commands must return the following verbs: OPEN, CLOSED, OPENING, CLOSING, STOPPED.

## FAQ
### Can I have multiple garage doors?
Yes! but this is a feature of homebridge, not the plugin.  Just add an additonal accessory with a different name than your other garage door.

### Can you add 'x' feature?
Yes, I probably could.  Will I?  Probably not.  If there is a feature you want to add, please feel free to code it yourself and submit a pull request so others can benefit.

### What is the STOPPED status?
STOPPED is a valid status for a door to be in, but in the Home App, it is actually reported as OPEN. If an error occures in getting the status, STOPPED should be returned, and it will be logged, but the plugin has the `ignore_errors` config option so that a false OPEN event won't be triggered. Be careful with `ignore_errors` as it can be somewhat dangerous to report an error as CLOSED.

