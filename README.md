# Chronometer Display

**Chronometer Display** is an application that provides a visual countdown timer that can be controlled remotely. The app was created to aid speakers in keeping track of time when doing public speeches.

Technically, it is a multi-platform desktop application controlled through another web page in a local network.

## Getting started

### Download

Access [Github's release page](https://github.com/gustavovaliati/cron-display/releases), and download the latest version according to your Operating System target:
* For Windows, download the `.exe`.
* For Linux, download the `.AppImage`.
* For Mac: TODO;

### Install

The app requires no installation, just double-click the executable you downloaded.

### Using it

1. Open the Chronometer Display:

Open the ChronometerDisplay app. You should see a blank dark page with a clock displayed on the bottom.
On the desktop app, you should see the timer displaying as you set time and commands on the controller app. Use the menus to see extra functions, like Window > Full Screen.

<pic>

2. Open the Remote Controller:

On the menu, click `Open > Controller`. It will open a Web Page with the Controller app. You should see `Ready` on the bottom if the application works.

Click on the Minutes and Seconds buttons to set up a timer defined in the grey, then click `Start`. The other control buttons are intuitive.

To control the timer from another device, copy the web app address which should be `http://localhost:8085/control.html` and replace `localhost` with the IP Address of the machine where the `Chronometer Display` is being executed.

#### Troubleshooting

* If the Controller page get's stopped by the browser, you will see disconnection issue on the screen: just refresh the page to solve it.

## Features

> The app is currently in its early days, so take it as a pre-released alpha.

1. Desktop app with a visual countdown timer;
   1. Countdown Timer;
      1. Progress bar showing the time completition;
      2. Progress bar changes colors: starts as Green, changes to Blue at 50%, Yellow at 80%, Orange at 90%, and Red at 100%;
      3. When time is up, the countdown continues counting negatively.
   2. Responsive UI;
2. Remote Controller:
   1. Accessible via any Web Browser in any device connected to the local network;
   2. Shows the remaining time in the bottom of the screen, so one doesn't need to keep looking at the displaying monitor;
   3. Allows multiple simultaneous connected users;
3. Multi-platform.

## Development & Collaboration

**Chronometer Display** is is an Electron-based application which provides an WebSocket server to receive commands and updates the countdown display accordingly from another served page.

### Requirements

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [Electron](https://www.electronjs.org/)

### Manual Source Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/your-username/chronometer-display.git
    cd chronometer-display
    ```
2. Install the required dependencies::

    ```bash
    npm install
    ```
3. Start the application::

    ```bash
    npm start
    ```

### Building for Production

Building requires .

You can build the project for Windows and Linux using Electron Builder. To do this, make sure Docker available in the machine, and then run:

    ```bash
    docker run --rm -ti \
		-v ${PWD}:/project \
		-v ${PWD}/dist:/project/dist \
		electronuserland/builder:wine \
		/bin/bash -c "npm install && npm run build:all"
    ```
Or 
    ```bash
    make build-all
    ```


This will generate executable files for both Windows and Linux in the dist folder.

