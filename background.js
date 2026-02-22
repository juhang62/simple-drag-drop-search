var searray = [
    "https://www.google.com/search?q=",
    "https://en.wikipedia.org/wiki/",
    "https://maps.google.com/maps?q=",
    "https://www.youtube.com/results?search_query=",
    "https://www.google.com/search?tbm=isch&q=",
    "https://mail.google.com/mail/?fs=1&tf=1&source=ig&view=cm&to=&cc=&bcc=&su=&body=",
    "https://twitter.com/search?f=realtime&q=",
    "https://www.flickr.com/search/?q=",
    "",
    "",
    "http://www.tumblr.com/tagged/",
    "http://www.pinterest.com/search/pins/?q=",
    "http://www.reddit.com/search?q=",
    "https://vine.co/search/",
    "http://digg.com/search?q=",
    "http://OpenURL.open/",
    "http://Clipboard.Clipboard/",
    "http://Textfile.Textfile/"
];
var tabindexflag = false;
var tabactiveflag = true;
var xval = 70;
var yval = 70;
var dropmode = false;
var faviconmode = false;
var msgtimerid = null;

function setSearchMode(val1,val2){
    dropmode = val1;
    faviconmode = val2;
}
function setForeBackTab(val){
    tabactiveflag = val;
}
function setTabPos(val){
    tabindexflag = val;
}
function setDetectValue(val){
    xval = parseInt(val);
    yval = parseInt(val);
}
function setSearchEngine(id,se){
    searray[id] = se;
    var obj = {};
    obj["se"+id] = se;
    chrome.storage.local.set(obj);
}
async function loadSearchEngine(){
    var keys = [];
    for(var i = 0; i < 18; i++){
        keys.push("se"+i);
    }
    var result = await chrome.storage.local.get(keys);
    for(var i = 0; i < 18; i++){
        var se = result["se"+i];
        if(se){
            searray[i] = se;
        }
    }
}
function createTab(url,word,idx,force){
    var sword = encodeURIComponent(word);
    chrome.tabs.query({active: true, currentWindow: true},function(tabs){
        var activeindex = tabs[0].index;
        chrome.tabs.query({currentWindow: true}, function(tabs2) {
            var tidx = tabs2.length;
            if(tabindexflag){
                tidx = activeindex + 1;
            }

            if(idx > 9){
                if(idx > 14){
                    idx -= 1;
                }
            }else{
                if(idx > 4){
                    idx -= 1;
                }
            }
            var tact = true;

            chrome.storage.local.get("tabselect"+idx, function(result) {
                var lcobj = result["tabselect"+idx];

                if(lcobj){
                    if(lcobj == "fore"){
                        tact = true;
                    }else if(lcobj == "back"){
                        tact = false;
                    }
                }else{
                    if(!tabactiveflag){
                        tact = false;
                    }
                }
                if(force){
                    tact = false;
                }

                var openurl;
                if(url == "http://OpenURL.open/"){
                    var encoded = encodeURIComponent(word);
                    encoded = encoded.replace(/%E2%80%8E$/, '');
                    var durl = decodeURIComponent(encoded)
                    if(durl.match(/^(http|https):\/\/.+$/)) {
                        openurl = durl;
                    }else{
                        openurl = "http://"+durl;
                    }
                }else{
                    var sword = encodeURIComponent(word);
                    openurl = url+sword;
                }
                chrome.tabs.create({
                    "url": openurl,
                    "index": tidx,
                    "active": tact
                });
            });
        });
    });
}
chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install"){
        setTimeout(function(){
            faviconmode = true;
            chrome.storage.local.set({"favicon_mode": "favicon"});
            openOptionsPage();
        },800);
    }
});
function openOptionsPage(){
    var optionsUrl = chrome.runtime.getURL("options.html");
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url === optionsUrl) {
                chrome.tabs.update(tabs[i].id, {"active": true});
                chrome.windows.update(tabs[i].windowId, {"focused": true});
                return;
            }
        }
        chrome.tabs.create({url: "options.html"});
    });
}
async function loadOptions(){
    var keys = ["detect_value", "tab_pos", "fore_back", "search_mode", "favicon_mode"];
    var result = await chrome.storage.local.get(keys);
    var dval = result["detect_value"];
    if(dval){
        xval = parseInt(dval);
        yval = parseInt(dval);
    }
    if(result["tab_pos"]){
        tabindexflag = true;
    }
    if(result["fore_back"]){
        tabactiveflag = false;
    }
    if(result["search_mode"]){
        dropmode = true;
    }
    if(result["favicon_mode"]){
        faviconmode = true;
    }
}
async function setChromeSync(msel){
    var opt = await opt2obj(msel);
    var obj = {
        "options":opt
    };
    chrome.storage.sync.set(obj,function(){
    });
}
async function opt2obj(mselval){
    var optobj = {};
    var flg = false;

    var keys = [];
    for(var i = 0; i < 8; i++){
        keys.push("se"+i, "text"+i, "select"+i, "tabselect"+i);
    }
    for(var i = 10; i < 18; i++){
        keys.push("se"+i, "text"+i, "select"+i, "tabselect"+i);
    }
    keys.push("detect_value", "tab_pos", "fore_back");

    var result = await chrome.storage.local.get(keys);

    for(var i = 0; i < 8; i++){
        var se = result["se"+i];
        if(se){
            flg = true;
            optobj["se"+i] = se;
        }
        var sec = result["text"+i];
        if(sec){
            flg = true;
            optobj["text"+i] = sec;
        }
        var sel = result["select"+i];
        if(sel){
            flg = true;
            optobj["select"+i] = sel;
        }
        var seact = result["tabselect"+i];
        if(seact){
            flg = true;
            optobj["tabselect"+i] = seact;
        }
    }
    for(var i = 10; i < 18; i++){
        var se = result["se"+i];
        if(se){
            flg = true;
            optobj["se"+i] = se;
        }
        var sel = result["select"+i];
        if(sel){
            flg = true;
            optobj["select"+i] = sel;
        }
        var sec = result["text"+i];
        if(sec){
            flg = true;
            optobj["text"+i] = sec;
        }
        var seact = result["tabselect"+i];
        if(seact){
            flg = true;
            optobj["tabselect"+i] = seact;
        }
    }
    var dval = result["detect_value"];
    if(dval){
        flg = true;
        optobj["detect_value"] = dval;
    }
    if(result["tab_pos"]){
        flg = true;
        optobj["tab_pos"] = "after";
    }
    if(result["fore_back"]){
        flg = true;
        optobj["fore_back"] = "back";
    }
    if(mselval == "favicon"){
        optobj.sddmode = "favicon";
    }else if(mselval == "drop"){
        optobj.sddmode = "drop";
    }else{
        optobj.sddmode = "arrow";
    }
    if(flg){
        optobj.daffunda = "daffunda";
        return optobj;
    }
    return null;
}

async function ensureOffscreenDocument() {
    var existingContexts = await chrome.runtime.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"]
    });
    if (existingContexts.length > 0) {
        return;
    }
    await chrome.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["CLIPBOARD"],
        justification: "Copy text to clipboard"
    });
}

async function copyStrings(str){
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({action: "copyToClipboard", text: str});
}

function exportTextFile(text){
    if(text){
        var blob = new Blob([text], {'type': 'text/plain'});
        var url = URL.createObjectURL(blob);
        chrome.downloads.download({url:url,saveAs:true,filename:"SelectedText.txt"},function(dlid){
            setTimeout(function(){
            	URL.revokeObjectURL(url);
            },30000);
        });
    }
}
function resendInfo(){}
function createMemoWindow(createflag,copystr){
    chrome.tabs.query({windowType:"popup"},function(tabs){
        var flg = false;
        for(var i = 0, l = tabs.length; i < l; i++){
            var url = tabs[i].url;
            var ttl = tabs[i].title;
            var wid = tabs[i].windowId;
            var tabid = tabs[i].id;
            if(url.match(/chrome-extension:\/\/.+\/memo\.html/,i)){
                if(ttl == "Memo (Chrome)"){
                    chrome.windows.update(wid,{focused:true});
                    flg = true;
                    chrome.tabs.sendMessage(tabid, {wind: "stat",sel:copystr});
                    break;
                }
            }
        }
        if(!flg&&createflag){
            var optobj3 = {url:"memo.html",type: "popup", width: 400, height: 300};
            chrome.windows.create(optobj3,function(wind){
                var tabid = wind.tabs[0].id;
                setTimeout(function(){
                    chrome.tabs.sendMessage(tabid, {wind: "stat",sel:copystr});
                },600);
            });
        }
    });
}
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if(msg.action === "copyToClipboard"){
        // Handled by offscreen document, ignore here
        return false;
    }
    if(msg.stat == "init"){
        (async function(){
            await loadSearchEngine();
            await loadOptions();
            var valobj = {};
            valobj.x = xval;
            valobj.y = yval;
            var mode = dropmode;
            var fm = faviconmode;
            sendResponse({val: valobj, sengin: searray,mode:mode,fm:fm});
        })();
        return true; // keep message channel open for async response
    }else if(msg.stat == "search"){
        (async function(){
            await loadSearchEngine();
            await loadOptions();
            var data = msg.data;
            var se = msg.se;
            var idx = msg.idx;
            var force = msg.force;

            if(se == "http://Clipboard.Clipboard/"){
                copyStrings(data);
            }else if(se == "http://Textfile.Textfile/"){
                exportTextFile(data);
            }else if(se == "http://Memo.Memo/"){
                createMemoWindow(true,data);
            }else if(se == "http://Speech.Speech/"){
                var vlist = [];
                chrome.tts.getVoices(function(voices) {
                    for (var i = 0; i < voices.length; i++) {
                        if(voices[i].lang){
                            vlist.push(voices[i].lang);
                        }
                    }
                    chrome.tabs.sendMessage(sender.tab.id, {msg: "speaking",data:data,vlist:vlist});
                });
            }else if(se == "http://OpenURL.open/"){
                if(data.indexOf("ttp") === 0){
                    data = "h"+data;
                }
                createTab(se,data,idx,force);
            }else{
                createTab(se,data,idx,force);
            }
            sendResponse({});
        })();
        return true;
    }else if(msg.msg == "options"){
        openOptionsPage();
        sendResponse({});
    }else if(msg.snd == "selecttxt"){
        var sel = msg.seltxt;
        createMemoWindow(false,"");
        sendResponse({});
    }else if(msg.action === "setChromeSync"){
        setChromeSync(msg.mselval);
        sendResponse({});
    }else if(msg.action === "setSearchMode"){
        setSearchMode(msg.val1, msg.val2);
        sendResponse({});
    }else if(msg.action === "setForeBackTab"){
        setForeBackTab(msg.val);
        sendResponse({});
    }else if(msg.action === "setTabPos"){
        setTabPos(msg.val);
        sendResponse({});
    }else if(msg.action === "setDetectValue"){
        setDetectValue(msg.val);
        sendResponse({});
    }else if(msg.action === "setSearchEngine"){
        setSearchEngine(msg.id, msg.se);
        sendResponse({});
    }else if(msg.action === "resendInfo"){
        resendInfo();
        sendResponse({});
    }else if(msg.action === "opt2obj"){
        (async function(){
            var result = await opt2obj(msg.mselval);
            sendResponse({result: result});
        })();
        return true;
    }else if(msg.action === "loadOptions"){
        (async function(){
            await loadOptions();
            sendResponse({});
        })();
        return true;
    }else{
        sendResponse({});
    }
});
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
    });
});
