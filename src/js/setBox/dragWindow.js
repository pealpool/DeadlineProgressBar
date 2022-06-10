"use strict";

//拖动窗体
let wX = 0;
let wY = 0;
let dragging = false;

$("#index_body").mousedown(function (e) {
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
