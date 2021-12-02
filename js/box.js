'use strict';


$('#tab_l').click(function () {
    $(this).addClass('act');
    // $(this).find('.opSelected').eq(0).css('display', 'inline');
    $('#tab_l .myV').show('scale',{percent:10},200);
    $('#tab_r').removeClass('act');
    // $('#tab_r').find('.opSelected').eq(0).css('display', 'none');
    $('#tab_r .myV').hide('scale',{percent:10},200);
});

$('#tab_r').click(function () {
    $(this).addClass('act');
    // $(this).find('.opSelected').eq(0).css('display', 'inline');
    $('#tab_r .myV').show('scale',{percent:10},200);
    $('#tab_l').removeClass('act');
    // $('#tab_l').find('.opSelected').eq(0).css('display', 'none');
    $('#tab_l .myV').hide('scale',{percent:10},200);
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

