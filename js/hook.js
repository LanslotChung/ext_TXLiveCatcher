function recordHttpLog() {
    // 监听ajax的状态
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, {
            detail: this
        })
        window.dispatchEvent(ajaxEvent)
    }
    var OldXHR = window.XMLHttpRequest
    function newXHR() {
        var realXHR = new OldXHR()
        realXHR.addEventListener('abort', function() { ajaxEventTrigger.call(this, 'ajaxAbort') }, false)
        realXHR.addEventListener('error', function() { ajaxEventTrigger.call(this, 'ajaxError') }, false)
        realXHR.addEventListener('load', function() { ajaxEventTrigger.call(this, 'ajaxLoad') }, false)
        realXHR.addEventListener('loadstart', function() { ajaxEventTrigger.call(this, 'ajaxLoadStart') }, false)
        realXHR.addEventListener('progress', function() { ajaxEventTrigger.call(this, 'ajaxProgress') }, false)
        realXHR.addEventListener('timeout', function() { ajaxEventTrigger.call(this, 'ajaxTimeout') }, false)
        realXHR.addEventListener('loadend', function() { ajaxEventTrigger.call(this, 'ajaxLoadEnd') }, false)
        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange') }, false)
        return realXHR
    }

    window.XMLHttpRequest = newXHR
    var lastSeq = 0;
    window.addEventListener('ajaxLoadEnd', function(e) {
        var url = e.detail.responseURL
        var status = e.detail.status
        var responseText = e.detail.response;
        var response = null;
        try{
            response = JSON.parse(responseText);
            if(url === 'https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/live/msg'){
                if(status == 200){
                    var msgList = response.data.msgList;
                    if(msgList.length == 0) return;
                    for(var i = 0 ; i < msgList.length ; i ++){
                        var msg = msgList[i];
                        if(lastSeq >= msgList[i].seq)
                            continue;
                        lastSeq = msg.seq;
                        window.postMessage({ message: "Shipinhao", data: msgList[i] }, '*');
                    }
                }
            }
        }catch(e){
        }
    })
}
recordHttpLog()