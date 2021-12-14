'use strict';

const {remote, clipboard, ipcRenderer} = require('electron');
let running = 's';// s(stop),l,r
let myDate;
let runningTimer;

// const winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
// const elem = document.getElementById("ProBar");
const elem = $('#ProBar');

/*function runPro() {
    let w = 10;
    const id = setInterval(function () {
        if (w >= 3440) {
            clearInterval(id);
        } else {
            w++;
            elem.style.width = w + 'px';
        }
    }, 10);
}*/
function runPro(message) {
    myDate = new Date();
    let point_s = myDate.getTime();
    let point_e;
    let targetTime;

    console.log(point_s);
    if (message.tab == 'l') {
        targetTime = (Number(message.time_h) * 3600 + Number(message.time_m) * 60) * 1000;

        elem.css('width', '0');
        runningTimer = setInterval(function () {
            //todo
        }, 10);


        /* //animate 难以修正误差
         elem.animate({width: '100%'}, 20000, 'linear', function () {
             myDate = new Date();
             point_e = myDate.getTime();
             console.log(point_e);
             console.log((point_e - point_s) / 1000);
         });*/

    } else {

    }


    /*    let w = 10;
        const id = setInterval(function () {
            if (w >= 3440) {
                clearInterval(id);
            } else {
                w++;
                elem.animate() = w + 'px';
            }
        }, 10);*/
}

const mbt = document.querySelector('#myBtTest');

function sendToMainProcess() {
    // 向主进程发送 imgUploadMain 事件
    ipcRenderer.send('imgUploadMain', {
        username: '22231',
        age: 18
    })
}

// 渲染进程监听 imgUploadMsgFromMain 事件
ipcRenderer.on('imgUploadMsgFromMain', (event, message) => {
    console.log('receive main process msg');
    console.log(JSON.stringify(message));
});

/*mbt.onclick = () => {
    sendToMainProcess();
};*/

ipcRenderer.on('startRun_toR', (event, message) => {
    console.log(JSON.stringify(message));
    runPro(message);
});