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
let mh = 0; //#figureChrRow的margin-top
let mi = 0; //滚动增删的div数
let i = 0; //提到全局，否则会产生多个
// let cici = 0;
$('.figureCut').mousedown(function (e) {
    i = 0;
    myEle = null;
    myEle = '#' + $(this).find('.figureChrRow').eq(0).attr('id');
    let hOrM = myEle.charAt(myEle.length - 1);
    // console.log(myEle);
    e.stopPropagation();
    e.preventDefault();
    timeDragging = true;
    // tX = e.pageX;
    tY = e.screenY;
    let elY = Number($(myEle).css('transform').replace(/[^0-9\-,]/g, '').split(',')[5]);
    // let elY = Number(document.defaultView.getComputedStyle(myEle, null).transform.replace(/[^0-9\-,]/g, '').split(',')[5]);
    $(window).mousemove(function (e) {
        if (timeDragging) {
            /*            let yLoc = elY + e.screenY - tY;
                        try {
                            // console.log(yLoc + '=' + elY + '+' + e.screenY + '-' + tY);
                            if (yLoc > 0) {
                                yLoc = 0;
                            } else if (yLoc < (-fgChrH * 80)) {
                                yLoc = -fgChrH * 80;
                            }

                            console.log(yLoc);
                            $(myEle).css('transform', 'translateY(' + yLoc + 'px)');
                            // myEle.style.transform = 'translateY(' + yLoc + 'px)';
                            // window.moveTo(xLoc, yLoc);
                        } catch (err) {
                            console.log(err);
                        }*/
            let len = e.screenY - tY;
            let yLoc = elY + len;
            try {
                // console.log(yLoc);
                $(myEle).css('transform', 'translateY(' + yLoc + 'px)');
                let s = scrollDiv(myEle, len, hOrM, i);
                console.log('i = ' + i);
                /*                if (Math.abs(yLoc % fgChrH) > (fgChrH / 2)) {
                                    mh = -1560 - Math.floor(yLoc / fgChrH) * fgChrH;
                                } else {
                                    mh = -1560 - Math.ceil(yLoc / fgChrH) * fgChrH;
                                }
                                console.log(mh);*/
                // mh = mh - s[1];
                $(myEle).css('margin-top', mh + 'px');
                i = i + s;
            } catch (err) {
                console.log(err);
            }


        }
    });
    $(window).mouseup(function () {
        let clY = 0;
        // e.stopPropagation();
        timeDragging = false;
        // cici++;
        // console.log($(myEle) + 'cici:'+cici);

        try {
            clY = Number($(myEle).css('transform').replace(/[^0-9\-,]/g, '').split(',')[5]);
        } catch (err) {
            console.log(err);
        }

        let yLoc = Math.round(clY / fgChrH) * fgChrH;
        $(myEle).css('transform', 'translateY(' + yLoc + 'px)');
        $(window).unbind('mouseup');
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


// 滚动增删div
function scrollDiv(that, len, hOrM, i) {
    let topNum = '';
    //todo i打双来，莫非要用全局i？
    //https://whimsical.com/len-FLycbY7B7NaSbJoCccUpjq
    if (len >= 0) {
        if (len >= fgChrH * i + fgChrH / 2) {

            $(that).children(':last').remove();
            topNum = $(that).children(':first').text();
            console.log(topNum);
            topNum--;
            if (hOrM == 'h') {
                if (topNum < 0) {
                    topNum = 23;
                }
            } else {
                if (topNum < 0) {
                    topNum = 59;
                }
            }
            topNum = addZero(topNum);
            $(that).prepend('<div class="figureChr">' + topNum + '</div>');
            mi++;
            console.log('mi = ' + mi);
            mh = -fgChrH * mi;
            console.log('mh = ' + mh);
            return 1;

        } else {
            if (i != 0) {
                $(that).children(':first').remove();
                topNum = $(that).children(':last').text();
                console.log(topNum);
                topNum++;
                if (hOrM == 'h') {
                    if (topNum > 23) {
                        topNum = 0;
                    }
                } else {
                    if (topNum > 59) {
                        topNum = 0;
                    }
                }
                topNum = addZero(topNum);
                $(that).append('<div class="figureChr">' + topNum + '</div>');
                mi--;
                console.log('mi = ' + mi);
                mh = -fgChrH * mi;
                console.log('mh = ' + mh);
                return -1;
            } else {
                return 0;
            }

        }
    } else {

        if (len <= fgChrH * i - fgChrH / 2) {

            $(that).children(':first').remove();
            topNum = $(that).children(':last').text();
            console.log(topNum);
            topNum++;
            if (hOrM == 'h') {
                if (topNum > 23) {
                    topNum = 0;
                }
            } else {
                if (topNum > 59) {
                    topNum = 0;
                }
            }
            topNum = addZero(topNum);
            $(that).append('<div class="figureChr">' + topNum + '</div>');
            mi--;
            console.log('mi = ' + mi);
            mh = -fgChrH * mi;
            console.log('mh = ' + mh);
            return -1;

        } else {
            if (i != 0) {
                $(that).children(':last').remove();
                topNum = $(that).children(':first').text();
                console.log(topNum);
                topNum--;
                if (hOrM == 'h') {
                    if (topNum < 0) {
                        topNum = 23;
                    }
                } else {
                    if (topNum < 0) {
                        topNum = 59;
                    }
                }
                topNum = addZero(topNum);
                $(that).prepend('<div class="figureChr">' + topNum + '</div>');
                mi++;
                console.log('mi = ' + mi);
                mh = -fgChrH * mi;
                console.log('mh = ' + mh);
                return 1;
            } else {
                return 0;
            }

        }

    }
}

function addZero(a) {
    if (a < 10) {
        return '0' + a;
    } else {
        return a;
    }
}
