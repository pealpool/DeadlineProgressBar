'use strict';
const electron = require('electron');
const {BrowserWindow,BrowserView,app, Menu, Tray, ipcMain, globalShortcut,} = electron;
const path = require('path');


let setBoxWin;
let tray = null

function create_setBoxWin() {
    // 创建窗口并加载页面
    const winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
    const winH = electron.screen.getPrimaryDisplay().workAreaSize.height;
    const wi = 329;
    const hi = 244;
    const pw = 16;
    const pht = 10;
    const phb = 20;
    Menu.setApplicationMenu(null)
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
            enableRemoteModule:true
        }
    });
    require('@electron/remote/main').initialize();
    require("@electron/remote/main").enable(setBoxWin.webContents);

    setBoxWin.loadURL(`file://${__dirname}/index.html`);
    // win.setIgnoreMouseEvents(true);
    setBoxWin.setMenu(null);
    // 窗口关闭的监听
    setBoxWin.on('closed', (event) => {
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
            label: '设置',
            click: () => {
                if (!setBoxWin.isVisible()){
                    setBoxWin.show();
                    setBoxWin.webContents.send('showWin');
                }
            }
        },
        {
            label: '退出',
            click: () => {
                app.quit();
            }
        }//我们需要在这里有一个真正的退出（这里直接强制退出）
    ])
    tray.setToolTip('My托盘测试');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
        //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
        if (!setBoxWin.isVisible()){
            setBoxWin.show();
            setBoxWin.webContents.send('showWin');
        }
    })

    // 禁用框架的右键菜单
    setBoxWin.hookWindowMessage(278, function (e) {
        setBoxWin.setEnabled(false); //窗口禁用
        setTimeout(() => {
            setBoxWin.setEnabled(true); //窗口启用
        }, 100); //延时太快会立刻启用，太慢会妨碍窗口其他操作，自行测试
        return true;
    })
}
//解决show窗口时闪烁
app.commandLine.appendSwitch('wm-window-animations-disabled');

app.on('ready', create_setBoxWin);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (setBoxWin === null) {
        create_setBoxWin();
    }
});

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
    console.log(message.time_h);

    //todo （发送目标的窗口）.webContents.send 才正确。
    //https://www.cnblogs.com/ybixian/p/10878899.html
    setBoxWin.webContents.send('startRun_toR', message);
})