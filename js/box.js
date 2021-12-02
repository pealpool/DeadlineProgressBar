'use strict';
// import drag from 'electron-drag';
// let drag = require('electron-drag');
// const drag = require('electron-drag');
// let noDrag = drag('#element');

// drag(document.getElementById('tab_r'));

// drag($('body'));

// $('.myTab').hover(
//     function (){
//         $(this).addClass('act');
//     },
//     function (){
//         $(this).removeClass('act');
//     }
// );

$('#tab_l').click(function () {
    $(this).addClass('act');
    $(this).find('.opSelected').eq(0).css('display', 'inline');
    $('#tab_r').removeClass('act');
    $('#tab_r').find('.opSelected').eq(0).css('display', 'none');
});

$('#tab_r').click(function () {
    $(this).addClass('act');
    $(this).find('.opSelected').eq(0).css('display', 'inline');
    $('#tab_l').removeClass('act');
    $('#tab_l').find('.opSelected').eq(0).css('display', 'none');
});

// $('.myTab').mousedown(function (){
//     $(this).css('-webkit-app-region','drag');
//     console.log($(this).css('-webkit-app-region'));
// });
//
// $('body').mouseup(function (){
//     $('.myTab').css('-webkit-app-region','no-drag');
//     console.log($('.myTab').css('-webkit-app-region'));
// });


// $('body').on('mousedown','.myTab',function (){
//     $('.myTab').css('-webkit-app-region','drag');
//     console.log($('.myTab').css('-webkit-app-region'));
// });
//
// $('body').on('mouseup','.myTab',function (){
//     $('.myTab').css('-webkit-app-region','no-drag');
//     console.log($('.myTab').css('-webkit-app-region'));
// });

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

//
// $(document).ready(function () {
//     let wX = 0;
//     let wY = 0;
//     let dragging = false;
//     $('#index_body').mousedown(function (e) {
//         let flag = false;
//         let stop;
//         stop = setTimeout(function () {//down .5s，才运行。
//             flag = true;
//             if(flag){
//                 dragging = true;
//                 wX = e.pageX;
//                 wY = e.pageY;
//                 // console.log(wX,wY);
//                 $(window).mousemove(function (e) {
//                     e.stopPropagation();
//                     e.preventDefault();
//                     if (dragging) {
//                         let xLoc = e.screenX - wX;
//                         let yLoc = e.screenY - wY;
//                         // console.log(xLoc, yLoc);
//                         try {
//                             window.moveTo(xLoc, yLoc);
//                         } catch (err) {
//                             console.log(err);
//                         }
//                     }
//                 });
//                 $(window).mouseup(function () {
//                     dragging = false;
//                 });
//             }
//         }, 100);
//         $('#index_body').mouseup(function () {//鼠标up时，判断down了多久，不足一秒，不执行down的代码。
//             if (!flag) {
//                 clearTimeout(stop);
//             }
//         });
//     });
//
// });