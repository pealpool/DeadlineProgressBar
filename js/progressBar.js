'use strict';

const {remote, clipboard, ipcRenderer } = require('electron');


// const winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
let getOk = false;



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
            console.log(getOk);
            if (getOk){
                console.log(w);
            }
        }
    }
}

const mbt = document.querySelector('#myBtTest');

function sendToMainProcess () {
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
    getOk = true;
    console.log('ok');
    console.log(JSON.stringify(message));
});