'use strict';
// const electron = require('electron');
// const {app, Menu, Tray} = electron;
// const {BrowserWindow} = electron;
// const path = require('path');
const {BrowserWindow, screen} = require('@electron/remote');
const {remote, clipboard, ipcRenderer} = require('electron');

$('#tab_l').click(function () {
    $(this).addClass('act');
    // $(this).find('.opSelected').eq(0).css('display', 'inline');
    $('#tab_l .myV').show('scale', {percent: 10}, 200);
    $('#tab_r').removeClass('act');
    // $('#tab_r').find('.opSelected').eq(0).css('display', 'none');
    $('#tab_r .myV').hide('scale', {percent: 10}, 200);
});

$('#tab_r').click(function () {
    $(this).addClass('act');
    // $(this).find('.opSelected').eq(0).css('display', 'inline');
    $('#tab_r .myV').show('scale', {percent: 10}, 200);
    $('#tab_l').removeClass('act');
    // $('#tab_l').find('.opSelected').eq(0).css('display', 'none');
    $('#tab_l .myV').hide('scale', {percent: 10}, 200);
});

$(document).ready(function () {
    let wX = 0;
    let wY = 0;
    let dragging = false;
    $('#index_body').mousedown(function (e) {

        dragging = true;
        wX = e.pageX;
        wY = e.pageY;
        // console.log(wX,wY);
        $(window).mousemove(function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (dragging) {
                let xLoc = e.screenX - wX;
                let yLoc = e.screenY - wY;
                // console.log(xLoc, yLoc);
                try {
                    window.moveTo(xLoc, yLoc);
                } catch (err) {
                    console.log(err);
                }
            }
        });
        $(window).mouseup(function () {
            dragging = false;
        });
    });
});


let newWin = null;
$('#startNew').click(function () {
    const winW = screen.getPrimaryDisplay().workAreaSize.width;
    const winH = screen.getPrimaryDisplay().workAreaSize.height;
    //调用 BrowserWindow打开新窗口
    newWin = new BrowserWindow({

        width: winW,
        height: 400,
        // x: 0,
        // y: 1410 - 2,
        // frame: false,
        useContentSize: false,
        resizable: false,
        // transparent: true,
        // alwaysOnTop: true,


        webPreferences: {
            contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
            nodeIntegration: true
        }
    })
    //打开一个新的窗口
    // newWin.loadURL(`file://${__dirname}/otherWin.html`);
    //新建窗口
    newWin.loadURL(`file://${__dirname}/progressBar.html`);
    newWin.on('close', () => {
        newWin = null
    });
});


//
// const btn = document.querySelector('#startNew');
// //渲染进程没法直接调用主进程中的模块，但是我们可以通过 electron中的remote模块间接的调用主进程中的模块
// //remote执行主进程与渲染进程之间的IPC
// // const BrowserWindow = require('electron').remote.BrowserWindow;
// // const BrowserWindow = require('electron').BrowserWindow;
//
// let newWin = null;
// window.onload = function () {
//     btn.onclick = () => {
//         const winW = screen.getPrimaryDisplay().workAreaSize.width;
//         const winH = screen.getPrimaryDisplay().workAreaSize.height;
//         //调用 BrowserWindow打开新窗口
//         newWin = new BrowserWindow({
//
//             width: winW,
//             height: 400,
//             // x: 0,
//             // y: 1410 - 2,
//             // frame: false,
//             useContentSize: false,
//             resizable: false,
//             // transparent: true,
//             // alwaysOnTop: true,
//
//
//             webPreferences: {
//                 contextIsolation: false, // 设置此项为false后，才可在渲染进程中使用electron api
//                 nodeIntegration: true
//             }
//         })
//         //打开一个新的窗口
//         // newWin.loadURL(`file://${__dirname}/otherWin.html`);
//         //新建窗口
//         newWin.loadURL(`file://${__dirname}/progressBar.html`);
//         newWin.on('close', () => {
//             newWin = null
//         })
//     }
// }
