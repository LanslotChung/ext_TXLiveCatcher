//向抖音注入js
var script = document.createElement("script");
script.src = chrome.runtime.getURL("js/hook.js");
document.documentElement.appendChild(script);
var isSend = false;
var isDebug = false;
var outsideWebsocket = null;
chrome.storage.local.get(["shipinhao_server", "shipinhao_debug", "shipinhao_send"]).then((result) => {
  isDebug = result.shipinhao_debug;
  isSend = result.shipinhao_send;
  if (result.shipinhao_server) {
    if (isSend) {
      //创建可重连WebSocket
      outsideWebsocket = new ReconnectingWebSocket(result.shipinhao_server);
      outsideWebsocket.debug = true;
      outsideWebsocket.timeoutInterval = 1000;
    }
  }
});

//监听来自注入JS的消息
window.addEventListener("message", function (event) {
  if (event.data.message == "Shipinhao") {
    let e = event.data.data;
    var msg = {
      method: 'WebcastChatMessage',
      userid: e.username,
      nickname: e.nickname,
      gender: -1,
      avatar: e.headUrl,
      chat: e.content,
    };
    isSend && msg &&
      outsideWebsocket &&
      outsideWebsocket.readyState === 1 &&
      outsideWebsocket.send(JSON.stringify(msg));
    isDebug && msg && console.log(JSON.stringify(msg));
  }
});