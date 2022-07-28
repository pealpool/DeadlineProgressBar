"use strict";
// const electron = require('electron');
// const {app, Menu, Tray} = electron;
// const {BrowserWindow} = electron;
// const path = require('path');
// window.$ = window.jQuery = require('jquery');
// const { BrowserWindow, screen } = require("@electron/remote");
const { ipcRenderer } = require("electron");
import "./dragWindow.js"; //拖动窗体
import "./startButton.js"; //开始按钮
import "./hideButton.js"; //隐藏按钮
import "./digitChange.js"; //数字变化
import "./timeListButton.js"; //预设按钮


$("#tab_l").click(function () {
  $(this).addClass("act");
  // $(this).find('.opSelected').eq(0).css('display', 'inline');
  $("#tab_l .myV").show("scale", { percent: 10 }, 200);
  $("#tab_r").removeClass("act");
  // $('#tab_r').find('.opSelected').eq(0).css('display', 'none');
  $("#tab_r .myV").hide("scale", { percent: 10 }, 200);
});

$("#tab_r").click(function () {
  $(this).addClass("act");
  // $(this).find('.opSelected').eq(0).css('display', 'inline');
  $("#tab_r .myV").show("scale", { percent: 10 }, 200);
  $("#tab_l").removeClass("act");
  // $('#tab_l').find('.opSelected').eq(0).css('display', 'none');
  $("#tab_l .myV").hide("scale", { percent: 10 }, 200);
});

/*

function createBarWin() {
    const winW = screen.getPrimaryDisplay().workAreaSize.width;
    const winH = screen.getPrimaryDisplay().workAreaSize.height;
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
*/

ipcRenderer.on("showWin", (event, message) => {
  $("#index_div").show("scale", {percent: 10}, 100);
});
