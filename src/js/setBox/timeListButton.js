"use strict";

$(".timeListTabShort").click(function () {
  let h = 0;
  let m = 0;
  let elSpan = $(this).children("span");
  // console.log(elSpan.eq(0).html());
  if ($(this).children("span").eq(0).html() === "m") {
    m = elSpan.eq(1).html();
  } else {
    h = elSpan.eq(1).html();
  }
  // console.log(h + "h " + m + "m");
});
