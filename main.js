'use strict';
const electron = require('electron');
const {BrowserWindow, app, Menu, Tray, ipcMain} = electron;
const path = require('path');
const {screen} = require("@electron/remote/main");


let setBoxWin, pgBarWin;
let tray = null;
let winW, winH;

//解决show窗口时闪烁
app.commandLine.appendSwitch('wm-window-animations-disabled');

app.on('ready', function () {
    winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
    winH = electron.screen.getPrimaryDisplay().workAreaSize.height;
    create_setBoxWin();
    create_bgBarWin();
    // pgBarWin.hide();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


/*app.on('activate', () => {
    if (setBoxWin === null) {
        create_setBoxWin();
        create_bgBarWin();
    }
});*/

// 主进程监听事件
ipcMain.on('imgUploadMain', (event, message) => {
    console.log('receive render process msg');
    console.log(JSON.stringify(message));
    // 主进程向渲染进程触发事件
    setBoxWin.webContents.send('imgUploadMsgFromMain', message);
})

ipcMain.on('hideWin', (event, message) => {
    setBoxWin.hide();
})

ipcMain.on('startRun_toM', (event, message) => {
    // console.log('receive render process msg');
    // console.log(JSON.stringify(message));
    // 主进程向渲染进程触发事件
    // console.log(JSON.stringify(message));
    // console.log(message.time_h);
    //todo winW 可能无用。
    message.screenW = winW;
    pgBarWin.webContents.send('startRun_toR', message);
})


function create_setBoxWin() {
    // 创建窗口并加载页面
    const wi = 329;
    const hi = 244;
    const pw = 16;
    const pht = 10;
    const phb = 20;
    Menu.setApplicationMenu(null);
    setBoxWin = new BrowserWindow({
        width: wi + pw * 2,
        maxWidth: wi + pw * 2,
        minWidth: wi + pw * 2,
        height: hi + pht + phb,
        maxHeight: hi + pht + phb,
        minHeight: hi + pht + phb,
        x: winW / 2 - wi / 2 - pw,
        y: winH / 2 - hi / 2 - pht,
        frame: false,
        useContentSize: false,
        resizable: false,
        // backgroundColor:'#00000000', //使字体渲染清晰
        transparent: true,
        alwaysOnTop: true,
        icon: path.join(__dirname, 'img/ico16.ico'),
        webPreferences: {
            contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    require('@electron/remote/main').initialize();
    require("@electron/remote/main").enable(setBoxWin.webContents);

    setBoxWin.loadURL(`file://${__dirname}/index.html`);
    // win.setIgnoreMouseEvents(true);
    setBoxWin.setMenu(null);
    // 窗口关闭的监听
    setBoxWin.on('closed', () => {
        setBoxWin = null;
    });
    setBoxWin.setSkipTaskbar(true);
    // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
    // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
    // win.on('close', (event) => {
    //     win.hide();
    //     win.setSkipTaskbar(true);
    //     event.preventDefault();
    // });

    //打开F12调试工具
    setBoxWin.webContents.openDevTools({mode: 'detach'});

    //创建系统通知区菜单
    tray = new Tray(path.join(__dirname, 'img/ico16.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '倒数设置',
            click: () => {
                if (!setBoxWin.isVisible()) {
                    setBoxWin.show();
                    setBoxWin.webContents.send('showWin');
                }
            }
        },
        {
            label: '颜色选择',
        },
        {
            label: '退出',
            click: () => {
                app.quit();
            }
        }//我们需要在这里有一个真正退出（这里直接强制退出）
    ])
    tray.setToolTip('剩余时间：');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
        //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
        if (!setBoxWin.isVisible()) {
            setBoxWin.show();
            setBoxWin.webContents.send('showWin');
        }
    })

    // 禁用框架的右键菜单
    setBoxWin.hookWindowMessage(278, function () {
        setBoxWin.setEnabled(false); //窗口禁用
        setTimeout(() => {
            setBoxWin.setEnabled(true); //窗口启用
        }, 100); //延时太快会立刻启用，太慢会妨碍窗口其他操作，自行测试
        return true;
    })
}

function create_bgBarWin() {

    //调用 BrowserWindow打开新窗口
    pgBarWin = new BrowserWindow({
        width: winW,
        height: 2,
        x: 0,
        y: winH - 2,
        frame: false,
        useContentSize: false,
        resizable: false,
        transparent: true,
        alwaysOnTop: true,

        webPreferences: {
            contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
            nodeIntegration: true
        }
    })
    //打开一个新的窗口
    // newWin.loadURL(`file://${__dirname}/otherWin.html`);
    //新建窗口
    pgBarWin.loadURL(`file://${__dirname}/progressBar.html`);
    pgBarWin.on('close', () => {
        pgBarWin = null
    });


    //打开F12调试工具
    pgBarWin.webContents.openDevTools({mode: 'detach'});

    //裁剪窗体成2px高，否则最少不能为2px高
    pgBarWin.setShape([
        {x: 0, y: 0, width: winW, height: 2}
    ]);
}
