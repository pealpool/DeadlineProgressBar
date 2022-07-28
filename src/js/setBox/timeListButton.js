"use strict";

$(".timeListTabShort").click(function () {
  //获取按钮时间
  let h = 0,
    m = 0;
  let elSpan = $(this).children("span");
  // console.log(elSpan.eq(0).html());
  if ($(this).children("span").eq(0).html() === "m") {
    m = elSpan.eq(1).html();
  } else {
    h = elSpan.eq(1).html();
  }
  // console.log(h + "h " + m + "m");

  //获取滚动设置台时间
  let time_h = $("#timeChrR_h .figureChr:nth-child(41)").text();
  let time_m = $("#timeChrR_m .figureChr:nth-child(41)").text();
  let time_s = $("#timeChrR_s .figureChr:nth-child(41)").text();

  console.log(upOrDown(h, time_h, true));
  console.log(upOrDown(m, time_m, false));
  console.log(upOrDown(0, time_s, false));
  if (upOrDown(0, time_s, false)) {
    //todo go on
  }
});

/**
 * 决定div上移还是下移
 * @param newValue 新值
 * @param oldValue 原来值
 * @param isHours true:24进制，false:60进制
 * @returns {boolean} true:div上移，false:下滚
 */
function upOrDown(newValue, oldValue, isHours) {
  let hex = 30;
  if (isHours) {
    hex = 12;
  }
  if (newValue > oldValue) {
    return parseInt(newValue) - parseInt(oldValue) <= hex;
  } else {
    return parseInt(oldValue) - parseInt(newValue) > hex;
  }
}

function clickAndScroll(newValue, oldValue, isHours, whichDiv) {
  if (upOrDown(newValue, oldValue, isHours)) {
  }
}
