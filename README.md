# homebridge-garagedoor-command
[Homebridge](https://github.com/nfarina/homebridge) plugin that supports triggering commands to check state, open, and close a garage door.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-garagedoor-command`
3. Update your configuration file. See `sample-config.json` in this repository for a sample.

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
    "status_update_delay": 10
  }
]

```
