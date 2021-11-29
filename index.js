'use strict';

// // 引入 electron模块
// const electron = require('electron');
// const {remote} = require("electron");
//
// // 创建 electron应用对象的引用
//
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
//
// // 定义变量 对应用视窗的引用
// let mainWindow = null;
//
// // 监听视窗关闭的事件
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });
//
// // 将index.html 载入应用视窗中
// app.on('ready', () => {
//     const winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
//     const winH = electron.screen.getPrimaryDisplay().workAreaSize.height;
//
//     mainWindow = new BrowserWindow({
//         // width: Desktop_width,
//         // minWidth: 1000,
//         width: winW,
//         height: 2,
//         x: 0,
//         y: winH - 2,
//         frame: false,
//         useContentSize:false,
//         resizable:false,
//         transparent: true,
//         alwaysOnTop: true,
//     });
//     mainWindow.setSkipTaskbar(true);
//     mainWindow.loadURL(`file://${__dirname}/index.html`);
//     mainWindow.on('closed', () => {
//         mainWindow = null;
//     });
// });


const electron = require('electron');
const {app, Menu, Tray} = electron;
const {BrowserWindow} = electron;
const path = require('path');

let win;
let tray = null

function createWindow() {
    // 创建窗口并加载页面
    const winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
    const winH = electron.screen.getPrimaryDisplay().workAreaSize.height;
    Menu.setApplicationMenu(null)
    win = new BrowserWindow({
        width: winW,
        height: 2,
        maxHeight: 2,
        x: 0,
        y: winH - 2,
        frame: false,
        useContentSize: false,
        resizable: false,
        transparent: true,
        alwaysOnTop: true,
        icon: path.join(__dirname, 'img/ico16.ico')
    });
    win.loadURL(`file://${__dirname}/index.html`);
    win.setIgnoreMouseEvents(true);
    win.setMenu(null);
    // 窗口关闭的监听
    win.on('closed', (event) => {
        win = null;
    });
    win.setSkipTaskbar(true);
    // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
    // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
    // win.on('close', (event) => {
    //     win.hide();
    //     win.setSkipTaskbar(true);
    //     event.preventDefault();
    // });

    //创建系统通知区菜单
    tray = new Tray(path.join(__dirname, 'img/ico16.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出',
            click: () => {win.destroy()}
        },//我们需要在这里有一个真正的退出（这里直接强制退出）
        {
            label: 'run',
            click: () => {
                runPro();
            }
        }
    ])
    tray.setToolTip('My托盘测试')
    tray.setContextMenu(contextMenu)
    // tray.on('click', () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    //     win.isVisible() ? win.hide() : win.show()
    //     win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
    // })
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});


// function runPro() {
//     const elem = document.getElementById("ProBar");
//     let w = 10;
//     const id = setInterval(frame, 10);
//
//     function frame() {
//         if (w >= 3440) {
//             clearInterval(id);
//         } else {
//             w++;
//             elem.style.width = w + 'px';
//         }
//     }
// }