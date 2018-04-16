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
    "status_update_delay": 15
  }
]

```
## Explanation:

Field                   | Description
------------------------|------------
**accessory**           | Must always be "GarageCommand". (required)
**name**                | Name of the Garage Door
**open**                | open command. Examples: ./open.sh or node open.js (required)
**close**               | close command. Examples: ./close.sh or node close.js (required)
**state**               | state command.  Examples: ./check_state.js or node state.js (required)
**status_update_delay** | Time to have door in opening or closing state (defaults to 15 seconds)

The open, close, and state commands must return the following verbs: OPEN, CLOSED, OPENING, CLOSING.
