'use strict';
// const electron = require('electron');
// const {app, Menu, Tray} = electron;
// const {BrowserWindow} = electron;
// const path = require('path');
const {BrowserWindow, screen} = require('@electron/remote');
const { ipcRenderer} = require('electron');

//拖动窗体
let wX = 0;
let wY = 0;
let dragging = false;
let scrolling = false;
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
let len = 0;
let divNum = 0;
let divTarget = 0;
let mgt = '';
$('.figureCut').mousedown(function (e) {

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
    mgt = $(myEle).css('margin-top');
    mgt = mgt.substring(0, mgt.length - 2);
    // console.log('margin-top = ' + mgt);
    // let elY = Number(document.defaultView.getComputedStyle(myEle, null).transform.replace(/[^0-9\-,]/g, '').split(',')[5]);
    // $(window).mousemove(function (e) {
    $(window).bind('mousemove', function (e) {
        // console.log(myEle);
        if (timeDragging) {

            len = e.screenY - tY;
            // let yLoc = elY + len;
            try {
                // console.log(yLoc);
                $(myEle).css('transform', 'translateY(' + (elY + len) + 'px)');
                // console.log(len);

                divTarget = myRound(len / fgChrH, 0);
                scrollDiv(myEle, hOrM);
            } catch (err) {
                console.log(err);
            }

        }
    });
    $(window).mouseup(function () {
        let clY = 0;
        // e.stopPropagation();
        timeDragging = false;

        try {
            clY = Number($(myEle).css('transform').replace(/[^0-9\-,]/g, '').split(',')[5]);
        } catch (err) {
            console.log(err);
        }

        let yLoc = myRound(clY / fgChrH, 0) * fgChrH;
        $(window).unbind('mouseup');
        $(window).unbind('mousemove');
        divNum = 0;
        // $(myEle).css('transform', 'translateY(' + yLoc + 'px)');
        myAnimate($(myEle), yLoc, 1.5);

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


// 滚动增删div
function scrollDiv(that, hOrM) {
    let topNum = '';
    // console.log('while front');
    while (divNum != divTarget) {
        // console.log('divNum = ' + divNum + ', divTarget = ' + divTarget);
        if (divTarget - divNum > 0) {
            $(that).children(':last').remove();
            topNum = $(that).children(':first').text();
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
            // console.log('add Top ' + topNum);
            divNum++;
        } else {
            $(that).children(':first').remove();
            topNum = $(that).children(':last').text();
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
            // console.log('add Bottom ' + topNum);
            divNum--;
        }
        mh = -fgChrH * divNum;
        // console.log('mgt = ' + mgt + ', mh = ' + mh);
        // mgt = Number(mgt) + Number(mh);
        $(myEle).css('margin-top', (Number(mgt) + Number(mh)) + 'px');
        // console.log('margin-top = ' + (Number(mgt) + Number(mh)));
    }
}

function addZero(a) {
    if (a < 10) {
        return '0' + a;
    } else {
        return a;
    }
}

//让-19.5能四舍五入成-20
function myRound(number, precision) {
    let _sign = (number < 0) ? -1 : 1;
    let _pow = Math.pow(10, precision);
    return Math.round((number * _sign) * _pow) / _pow * _sign;
}

function myAnimate(obj, target, speed, callback) {
    if (!scrolling) {
        scrolling = true;
        let clY = Number(obj.css('transform').replace(/[^0-9\-,]/g, '').split(',')[5]);
        clearInterval(obj.time);
        obj.time = setInterval(function () {
            let step = target - clY;
            step = step > 0 ? speed : -speed;
            clY = clY + step;
            if (Math.abs(target) - Math.abs(speed) < Math.abs(clY) && Math.abs(clY) < Math.abs(target) + Math.abs(speed)) {
                obj.css('transform', 'translateY(' + target + 'px)');
                clearInterval(obj.time);
                if (callback) {
                    callback();
                }
                scrolling = false;
            } else {
                obj.css('transform', 'translateY(' + clY + 'px)');
            }
        }, 10);
    }
}

$('.figureCut').on('mousewheel', function (e) {
    if (!timeDragging) {
        let l = e.originalEvent.deltaY;
        let topNum = '';
        myEle = null;
        myEle = '#' + $(this).find('.figureChrRow').eq(0).attr('id');
        let hOrM = myEle.charAt(myEle.length - 1);
        let elY = Number($(myEle).css('transform').replace(/[^0-9\-,]/g, '').split(',')[5]);
        // console.log(l);
        let n = Math.round(l / 100);
        l = n * fgChrH;
        let mt = $(myEle).css('margin-top');
        mt = mt.substring(0, mt.length - 2);
        // console.log('elY =' + elY + ', l = ' + l + ', translateY = ' + (elY - l) + ', mt = ' + mt);
        try {
            // $(myEle).css('transform', 'translateY(' + (elY - g) + 'px)');
            myAnimate($(myEle), (elY - l), 3, function () {
                if (n > 0) {
                    for (let i = 0; i < n; i++) {
                        $(myEle).children(':first').remove();
                        topNum = $(myEle).children(':last').text();
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
                        $(myEle).append('<div class="figureChr">' + topNum + '</div>');
                    }
                } else {
                    for (let i = 0; i < -n; i++) {
                        $(myEle).children(':last').remove();
                        topNum = $(myEle).children(':first').text();
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
                        $(myEle).prepend('<div class="figureChr">' + topNum + '</div>');
                    }
                }
                $(myEle).css('margin-top', (Number(mt) + l) + 'px');
            });

            // divTarget = myRound(len / fgChrH, 0);
            // scrollDiv(myEle, hOrM);
        } catch (err) {
            console.log(err);
        }
    }
});


$('#startNew').click(function () {
    let time_h = 0, time_m = 0, time_s = 0;
    if ($('#tab_r').attr('class') == 'myTab') {
        //勾选 #tab_l
        time_h = $('#timeChrL_h .figureChr:nth-child(41)').text();
        time_m = $('#timeChrL_m .figureChr:nth-child(41)').text();
        ipcRenderer.send('startRun_toM',{
            tab: 'l',
            time_h: time_h,
            time_m: time_m
        });
    } else {
        //勾选 #tab_r
        time_h = $('#timeChrR_h .figureChr:nth-child(41)').text();
        time_m = $('#timeChrR_m .figureChr:nth-child(41)').text();
        time_s = $('#timeChrR_s .figureChr:nth-child(41)').text();
        ipcRenderer.send('startRun_toM',{
            tab: 'r',
            time_h: time_h,
            time_m: time_m,
            time_s: time_s
        });
    }

    $('#index_div').hide('scale', {percent: 10}, 100, function () {
        ipcRenderer.send('hideWin');
    });
});

$('#hideButton_1').click(function () {
    $('#index_div').hide('scale', {percent: 10}, 100, function () {
        ipcRenderer.send('hideWin');
    });
});

ipcRenderer.on('showWin', (event, message) => {
    $('#index_div').show('scale', {percent: 10}, 100);
});