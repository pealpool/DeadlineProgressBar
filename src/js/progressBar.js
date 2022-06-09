"use strict";
const { ipcRenderer } = require("electron");

let myDate;
const elem = $("#ProBar");

function runPro(message) {
  elem.stop(true, true);
  myDate = new Date();
  let point_start =
    (myDate.getHours() * 3600 + myDate.getMinutes() * 60 + myDate.getSeconds()) * 1000;
  let targetTime, difTime;
  console.log(myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds());
  if (message.tab == "l") {
    targetTime = (Number(message.time_h) * 3600 + Number(message.time_m) * 60) * 1000;
    if (targetTime < point_start) {
      targetTime = targetTime + 12 * 3600 * 1000;
    }
    difTime = targetTime - point_start;
    elem.css("width", "0");
    elem.animate({ width: "100%" }, difTime, "linear", function () {
      myDate = new Date();
      let point_end =
        (myDate.getHours() * 3600 + myDate.getMinutes() * 60 + myDate.getSeconds()) *
        1000;
      console.log("误差：" + (point_end - targetTime) / 1000 + "s");
      console.log(
        myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()
      );
    });
  } else {
    difTime =
      (Number(message.time_h) * 3600 +
        Number(message.time_m) * 60 +
        Number(message.time_s)) *
      1000;
    //todo 合并重复代码, 等测试8h误差后。
    elem.css("width", "0");
    elem.animate({ width: "100%" }, difTime, "linear", function () {
      myDate = new Date();
      let point_end =
        (myDate.getHours() * 3600 + myDate.getMinutes() * 60 + myDate.getSeconds()) *
        1000;
      console.log("误差：" + (point_end - point_start - difTime) / 1000 + "s");
      console.log(
        myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()
      );
      //todo 到点提醒窗
    });
  }
}

const mbt = document.querySelector("#myBtTest");

function sendToMainProcess() {
  // 向主进程发送 imgUploadMain 事件
  ipcRenderer.send("imgUploadMain", {
    username: "22231",
    age: 18,
  });
}

// 渲染进程监听 imgUploadMsgFromMain 事件
ipcRenderer.on("imgUploadMsgFromMain", (event, message) => {
  console.log("receive main process msg");
  console.log(JSON.stringify(message));
});

/*mbt.onclick = () => {
    sendToMainProcess();
};*/

ipcRenderer.on("startRun_toR", (event, message) => {
  // console.log(JSON.stringify(message));
  runPro(message);
});
