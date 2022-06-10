const { ipcRenderer } = require("electron");

$("#hideButton_1").click(function () {
  $("#index_div").hide("scale", { percent: 10 }, 100, function () {
    ipcRenderer.send("hideWin");
  });
});
