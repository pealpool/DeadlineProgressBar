'use strict';
// const electron = require('electron');
// const {app, Menu, Tray} = electron;
// const {BrowserWindow} = electron;
// const path = require('path');
const {BrowserWindow, screen} = require('@electron/remote');
const {remote, clipboard, ipcRenderer} = require('electron');

//拖动窗体
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


//拖动时间
let fgChrH = 39;
let tY = 0;
let timeDragging = false;
let myEle;
$('.figureCut').mousedown(function (e) {
    //todo 务必要jq转Dom，注册不同ID尝试。还是不行，不关id的事，感觉myEle没释放。

    myEle = '#'+ $(this).find('.figureChrRow').eq(0).attr('id');
    console.log(myEle);
    e.stopPropagation();
    e.preventDefault();
    timeDragging = true;
    // tX = e.pageX;
    tY = e.screenY;
    let elY = Number($(myEle).css('transform').replace(/[^0-9\-,]/g, '').split(',')[5]);
    // let elY = Number(document.defaultView.getComputedStyle(myEle, null).transform.replace(/[^0-9\-,]/g, '').split(',')[5]);
    $(window).mousemove(function (e) {
        if (timeDragging) {
            let yLoc = elY + e.screenY - tY;
            try {
                // console.log(yLoc + '=' + elY + '+' + e.screenY + '-' + tY);
                $(myEle).css('transform', 'translateY(' + yLoc + 'px)');
                // myEle.style.transform = 'translateY(' + yLoc + 'px)';
                // window.moveTo(xLoc, yLoc);
            } catch (err) {
                console.log(err);
            }
        }
    });
    $(window).mouseup(function () {

        timeDragging = false;
        console.log($(myEle));
        // try {
        //     let clY = Number(myEle.css('transform').replace(/[^0-9\-,]/g, '').split(',')[5]);
        // } catch (err) {
        //     console.log(err);
        // }

        // let yLoc = 0;
        // if ((elY % fgChrH) > (39 / 2)) {
        //     yLoc = Math.floor(elY / fgChrH) * fgChrH;
        // } else {
        //     yLoc = Math.ceil(elY / fgChrH) * fgChrH;
        // }
        // console.log(yLoc);
        // myEle.css('transform', 'translateY(' + yLoc + 'px)');
        // myEle = null;
    });
});


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

let newWin = null;
$('#startNew').click(function () {
    $('#index_div').hide('scale', {percent: 10}, 100, function () {
        ipcRenderer.send('hideWin');
    });
    const winW = screen.getPrimaryDisplay().workAreaSize.width;
    const winH = screen.getPrimaryDisplay().workAreaSize.height;
    //调用 BrowserWindow打开新窗口
    newWin = new BrowserWindow({
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
    newWin.loadURL(`file://${__dirname}/progressBar.html`);
    newWin.on('close', () => {
        newWin = null
    });

    //裁剪窗体成2px高，否则最少不能为2px高
    newWin.setShape([
        {x: 0, y: 0, width: winW, height: 2}
    ]);

});

$('#hideButton_1').click(function () {
    $('#index_div').hide('scale', {percent: 10}, 100, function () {
        ipcRenderer.send('hideWin');
    });
});

ipcRenderer.on('showWin', (event, message) => {
    $('#index_div').show('scale', {percent: 10}, 100);
});