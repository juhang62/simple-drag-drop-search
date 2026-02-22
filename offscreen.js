chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action === "copyToClipboard") {
        var inpt = document.createElement("input");
        document.body.appendChild(inpt);
        inpt.setAttribute("type", "text");
        inpt.value = msg.text;
        inpt.focus();
        inpt.select();
        document.execCommand("copy");
        setTimeout(function() {
            document.body.removeChild(inpt);
        }, 1000);
        sendResponse({success: true});
    }
});
