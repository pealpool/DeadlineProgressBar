'use strict';

const electron = require("electron");
const remote = require('electron').remote;

// // const winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
runPro();

function runPro() {
    const elem = document.getElementById("ProBar");
    let w = 10;
    const id = setInterval(frame, 10);

    function frame() {
        if (w >= 3440) {
            clearInterval(id);
        } else {
            w++;
            elem.style.width = w + 'px';
        }
    }
}
