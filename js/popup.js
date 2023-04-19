const serverUrl = document.getElementById("server_url");
const confirm = document.getElementById("confirm");
const debug = document.getElementById("debug");
const send = document.getElementById("send");

chrome.storage.local.get(["shipinhao_server", "shipinhao_debug", "shipinhao_send"]).then((result) => {
    if (result.shipinhao_server)
        serverUrl.value = result.shipinhao_server;
    if (result.shipinhao_debug)
        debug.checked = result.shipinhao_debug;
    if (result.shipinhao_send)
        send.checked = result.shipinhao_send;
});

confirm.addEventListener("click", () => {
    chrome.storage.local.set({
        shipinhao_server: serverUrl.value,
        shipinhao_debug: debug.checked,
        shipinhao_send: send.checked
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
    window.close();
});