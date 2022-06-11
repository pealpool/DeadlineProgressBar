"use strict";

//拖动时间
let fgChrH = 39;
let tY = 0;
let timeDragging = false;
let myEle;
let mh = 0; //#figureChrRow的margin-top
let len = 0;
let divNum = 0;
let divTarget = 0;
let mgt = "";
$(".figureCut").mousedown(function (e) {
  myEle = null;
  myEle = "#" + $(this).find(".figureChrRow").eq(0).attr("id");
  let hOrM = myEle.charAt(myEle.length - 1);
  // console.log(myEle);
  e.stopPropagation();
  e.preventDefault();
  timeDragging = true;
  // tX = e.pageX;
  tY = e.screenY;
  let elY = Number(
    $(myEle)
      .css("transform")
      .replace(/[^0-9\-,]/g, "")
      .split(",")[5]
  );
  mgt = $(myEle).css("margin-top");
  mgt = mgt.substring(0, mgt.length - 2);
  // console.log('margin-top = ' + mgt);
  // let elY = Number(document.defaultView.getComputedStyle(myEle, null).transform.replace(/[^0-9\-,]/g, '').split(',')[5]);
  // $(window).mousemove(function (e) {
  $(window).bind("mousemove", function (e) {
    // console.log(myEle);
    if (timeDragging) {
      len = e.screenY - tY;
      // let yLoc = elY + len;
      try {
        // console.log(yLoc);
        $(myEle).css("transform", "translateY(" + (elY + len) + "px)");
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
      clY = Number(
        $(myEle)
          .css("transform")
          .replace(/[^0-9\-,]/g, "")
          .split(",")[5]
      );
    } catch (err) {
      console.log(err);
    }

    let yLoc = myRound(clY / fgChrH, 0) * fgChrH;
    $(window).unbind("mouseup");
    $(window).unbind("mousemove");
    divNum = 0;
    // $(myEle).css('transform', 'translateY(' + yLoc + 'px)');
    myAnimate($(myEle), yLoc, 1.5);
  });
});

// 滚动增删div
function scrollDiv(that, hOrM) {
  let topNum = "";
  // console.log('while front');
  while (divNum !== divTarget) {
    // console.log('divNum = ' + divNum + ', divTarget = ' + divTarget);
    if (divTarget - divNum > 0) {
      $(that).children(":last").remove();
      topNum = $(that).children(":first").text();
      topNum--;
      if (hOrM === "h") {
        if (topNum < 0) {
          topNum = 23;
        }
      } else {
        if (topNum < 0) {
          topNum = 59;
        }
      }
      topNum = addZero(topNum);
      $(that).prepend('<div class="figureChr">' + topNum + "</div>");
      // console.log('add Top ' + topNum);
      divNum++;
    } else {
      $(that).children(":first").remove();
      topNum = $(that).children(":last").text();
      topNum++;
      if (hOrM === "h") {
        if (topNum > 23) {
          topNum = 0;
        }
      } else {
        if (topNum > 59) {
          topNum = 0;
        }
      }
      topNum = addZero(topNum);
      $(that).append('<div class="figureChr">' + topNum + "</div>");
      // console.log('add Bottom ' + topNum);
      divNum--;
    }
    mh = -fgChrH * divNum;
    // console.log('mgt = ' + mgt + ', mh = ' + mh);
    // mgt = Number(mgt) + Number(mh);
    $(myEle).css("margin-top", Number(mgt) + Number(mh) + "px");
    // console.log('margin-top = ' + (Number(mgt) + Number(mh)));
  }
}

function addZero(a) {
  if (a < 10) {
    return "0" + a;
  } else {
    return a;
  }
}

//让-19.5能四舍五入成-20
function myRound(number, precision) {
  let _sign = number < 0 ? -1 : 1;
  let _pow = Math.pow(10, precision);
  return (Math.round(number * _sign * _pow) / _pow) * _sign;
}

let scrolling = false;

function myAnimate(obj, target, speed, callback) {
  if (!scrolling) {
    scrolling = true;
    let clY = Number(
      obj
        .css("transform")
        .replace(/[^0-9\-,]/g, "")
        .split(",")[5]
    );
    clearInterval(obj.time);
    obj.time = setInterval(function () {
      let step = target - clY;
      step = step > 0 ? speed : -speed;
      clY = clY + step;
      if (
        Math.abs(target) - Math.abs(speed) < Math.abs(clY) &&
        Math.abs(clY) < Math.abs(target) + Math.abs(speed)
      ) {
        obj.css("transform", "translateY(" + target + "px)");
        clearInterval(obj.time);
        if (callback) {
          callback();
        }
        scrolling = false;
      } else {
        obj.css("transform", "translateY(" + clY + "px)");
      }
    }, 10);
  }
}

$(".figureCut").on("mousewheel", function (e) {
  if (!timeDragging) {
    let l = e.originalEvent.deltaY;
    let topNum = "";
    myEle = null;
    myEle = "#" + $(this).find(".figureChrRow").eq(0).attr("id");
    let hOrM = myEle.charAt(myEle.length - 1);
    let elY = Number(
      $(myEle)
        .css("transform")
        .replace(/[^0-9\-,]/g, "")
        .split(",")[5]
    );
    // console.log(l);
    let n = Math.round(l / 100);
    l = n * fgChrH;
    let mt = $(myEle).css("margin-top");
    mt = mt.substring(0, mt.length - 2);
    // console.log('elY =' + elY + ', l = ' + l + ', translateY = ' + (elY - l) + ', mt = ' + mt);
    try {
      // $(myEle).css('transform', 'translateY(' + (elY - g) + 'px)');
      myAnimate($(myEle), elY - l, 3, function () {
        if (n > 0) {
          for (let i = 0; i < n; i++) {
            $(myEle).children(":first").remove();
            topNum = $(myEle).children(":last").text();
            topNum++;
            if (hOrM === "h") {
              if (topNum > 23) {
                topNum = 0;
              }
            } else {
              if (topNum > 59) {
                topNum = 0;
              }
            }
            topNum = addZero(topNum);
            $(myEle).append('<div class="figureChr">' + topNum + "</div>");
          }
        } else {
          for (let i = 0; i < -n; i++) {
            $(myEle).children(":last").remove();
            topNum = $(myEle).children(":first").text();
            topNum--;
            if (hOrM === "h") {
              if (topNum < 0) {
                topNum = 23;
              }
            } else {
              if (topNum < 0) {
                topNum = 59;
              }
            }
            topNum = addZero(topNum);
            $(myEle).prepend('<div class="figureChr">' + topNum + "</div>");
          }
        }
        $(myEle).css("margin-top", Number(mt) + l + "px");
      });

      // divTarget = myRound(len / fgChrH, 0);
      // scrollDiv(myEle, hOrM);
    } catch (err) {
      console.log(err);
    }
  }
});
