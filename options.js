var excpetoptionarray = [];
var excptidex = -1;
var changetextTimerid = null;
var searchenginary = [];
var searchnameary = [];
window.addEventListener("load", function(){
	createSubElement(0);
	chrome.storage.local.get("_except_url_",function(obj){
	    if(obj&&obj["_except_url_"]){
        	var eurlary = obj["_except_url_"];
    		for(var i = 0; i < eurlary.length; i++){
    			excpetoptionarray.push(eurlary[i]);
    			createExceptItem(eurlary[i].url);
    		}
	    }
	});
	chrome.storage.local.get("detect_value", function(result){
		var dval = result["detect_value"];
		if(dval){
			document.getElementById("detectval").value = dval;
			document.getElementById("detectvallbl").textContent = dval;
		}
	});
	chrome.storage.local.get(["tab_pos", "fore_back", "search_mode", "favicon_mode"], function(result){
		if(result["tab_pos"]){
			document.getElementById("tabposselect").value = result["tab_pos"];
		}
		if(result["fore_back"] != null && result["fore_back"] !== undefined){
			document.getElementById("forebacktabselect").value = "back";
		}
		if(result["search_mode"] != null && result["search_mode"] !== undefined){
			document.getElementById("modeselect").value = "drop";
		}
		if(result["favicon_mode"] != null && result["favicon_mode"] !== undefined){
			document.getElementById("modeselect").value = "favicon";
		}
	});
	document.getElementById("detectval").addEventListener("change",changeDetectVal,false);
	document.getElementById("tabposselect").addEventListener("change",changeTabPos,false);
	document.getElementById("forebacktabselect").addEventListener("change",changeForeBackTab,false);
	document.getElementById("modeselect").addEventListener("change",changeSearchMode,false);
	document.getElementById("shiftmodeselect").addEventListener("change",changeShiftMode,false);
    document.getElementById("hiddenfilebutton").addEventListener("change",fileHandler,false);
    document.getElementById("importbtn").addEventListener('click',clickImportButton,false);
    document.getElementById("exportbtn").addEventListener('click',clickExportButton,false);
    document.getElementById("getsyncbtn").addEventListener('click',getChromeSync,false);
	document.getElementById("addbutton2").addEventListener("click",clickAddButton2,false);
}, false);

function createExceptItem(inpuval){
	excptidex++;
	var maincont = document.getElementById("exceptpopupllist");

	var cont = document.createElement("div");
	maincont.appendChild(cont);
	cont.setAttribute("class","oinputcontclass");

	var cimg = document.createElement("img");
	cont.appendChild(cimg);
	cimg.setAttribute("src","closee.png");
	cimg.setAttribute("class","closeimgclass");
	cimg.index = excptidex;
	cimg.addEventListener("click",clickCloseImg2,false);

	var inpt = document.createElement("input");
	cont.appendChild(inpt);
	inpt.setAttribute("type","text");
	inpt.setAttribute("class","openurlitemclass");
	inpt.setAttribute("placeholder","URL");
	inpt.index = excptidex;
	inpt.value = inpuval;
	inpt.addEventListener("blur",blurExceptInput,false);
	inpt.setAttribute("id","exceptinput"+excptidex);
}
function blurExceptInput(e){
	var row = e.currentTarget;
	var val = row.value;
	val = val.replace(/^\s+|\s+$/g, "");
	if(val){
		setExceptOption(val,row.index);
	}else{
		setExceptOption(null,row.index);
		var prntnd = row.parentNode;
		prntnd.parentNode.removeChild(prntnd);
	}
}
function setExceptOption(val,index){
	if(val){
		var optionobj = {};
		optionobj.url = val;
		optionobj.sel = "1"	;
		excpetoptionarray[index] = optionobj;
	}else{
		excpetoptionarray[index] = null;
	}
	storeOption();
}
function clickCloseImg2(e){
	var eindx = e.currentTarget.index;
	var row = document.getElementById("exceptinput"+eindx);
	row.focus();
	row.value = "";
	row.blur();
}
function clickAddButton2(){
	createExceptItem("");
}
function storeOption(){
    var ary = [];
    for (var i = 0; i < excpetoptionarray.length; i++) {
        var item = excpetoptionarray[i];
        if(item){
            ary.push(item);
        }
    }
    var obj = {};
    obj["_except_url_"] = ary;
    chrome.storage.local.set(obj);
}
window.onbeforeunload  = function(){
	setChromeSync();
};
loadSearchEngineMenu();
function setChromeSync(){
    var mselval = document.getElementById("modeselect").value;
    if(mselval){
	    chrome.runtime.sendMessage({action: "setChromeSync", mselval: mselval});
    }
}
function getChromeSync(){
    chrome.storage.sync.get("options",function(obj){
    	console.log(obj.options);
    	obj2opt(obj.options);
    });
}
function changeShiftMode(e){
	for (var i = 0; i < 8; i++) {
		document.getElementById("sub"+i).innerHTML = "";
	}
	if(this.value == "drop"){
		createSubElement(0);
	}else{
		createSubElement(10);
	}
}
function changeSearchMode(e){
	var row = e.currentTarget;
	if(row.value == "drop"){
		chrome.runtime.sendMessage({action: "setSearchMode", val1: true, val2: false});
		chrome.storage.local.set({"search_mode": row.value});
		chrome.storage.local.remove("favicon_mode");
	}else if(row.value == "arrow"){
		chrome.runtime.sendMessage({action: "setSearchMode", val1: false, val2: false});
		chrome.storage.local.remove("search_mode");
		chrome.storage.local.remove("favicon_mode");
	}else if(row.value == "favicon"){
		chrome.runtime.sendMessage({action: "setSearchMode", val1: false, val2: true});
		chrome.storage.local.remove("search_mode");
		chrome.storage.local.set({"favicon_mode": row.value});
	}
	chrome.runtime.sendMessage({action: "resendInfo"});
}
function changeForeBackTab(e){
	var row = e.currentTarget;
	if(row.value == "back"){
		chrome.runtime.sendMessage({action: "setForeBackTab", val: false});
		chrome.storage.local.set({"fore_back": row.value});
	}else{
		chrome.runtime.sendMessage({action: "setForeBackTab", val: true});
		chrome.storage.local.remove("fore_back");
	}
}
function changeTabPos(e){
	var row = e.currentTarget;
	if(row.value == "after"){
		chrome.runtime.sendMessage({action: "setTabPos", val: true});
		chrome.storage.local.set({"tab_pos": row.value});
	}else{
		chrome.runtime.sendMessage({action: "setTabPos", val: false});
		chrome.storage.local.remove("tab_pos");
	}
}
function changeDetectVal(e){
	var row = e.currentTarget;
	document.getElementById("detectvallbl").textContent = row.value;
	chrome.storage.local.set({"detect_value": row.value});
	chrome.runtime.sendMessage({action: "setDetectValue", val: row.value});
	chrome.runtime.sendMessage({action: "resendInfo"});
}
function createSubElement(idx){
	for(var i = idx; i < 8+idx; i++){
		var inrcont = document.createElement("div");

		if(i > 9){
			var no = i-10;
			document.getElementById("sub"+no).appendChild(inrcont);
		}else{
			document.getElementById("sub"+i).appendChild(inrcont);
		}
		inrcont.setAttribute("class","subinner");

		var simg = document.createElement("img");
		inrcont.appendChild(simg);
		simg.setAttribute("id","favicon"+i);

		inrcont.appendChild(document.createElement("br"));

		var selelem = document.createElement("select");
		inrcont.appendChild(selelem);
		selelem.setAttribute("class","selectclass");
		selelem.setAttribute("id","select"+i);
		createSelectElement(selelem);
		selelem.addEventListener("change",clickSearchSelect,false);

		if(i == 0){
			selelem.selectedIndex = 0;
		}else if(i == 1){
			selelem.selectedIndex = 16;
		}else if(i == 2){
			selelem.selectedIndex = 2;
		}else if(i == 3){
			selelem.selectedIndex = 13;
		}else if(i == 4){
			selelem.selectedIndex = 1;
		}else if(i == 5){
			selelem.selectedIndex = 4;
		}else if(i == 6){
			selelem.selectedIndex = 17;
		}else if(i == 7){
			selelem.selectedIndex = 28;
		}else if(i == 10){
			selelem.selectedIndex = 19;
		}else if(i == 11){
			selelem.selectedIndex = 20;
		}else if(i == 12){
			selelem.selectedIndex = 21;
		}else if(i == 13){
			selelem.selectedIndex = 18;
		}else if(i == 14){
			selelem.selectedIndex = 22;
		}else if(i == 15){
			selelem.selectedIndex = 38;
		}else if(i == 16){
			selelem.selectedIndex = 39;
		}else if(i == 17){
			selelem.selectedIndex = 40;
		}
		inrcont.appendChild(document.createElement("br"));

		var inputelem = document.createElement("input");
		inrcont.appendChild(inputelem);
		inputelem.setAttribute("type","text");
		inputelem.setAttribute("class","textboxcalss");
		inputelem.setAttribute("id","text"+i);
		inputelem.disabled = true;
		inputelem.addEventListener("keyup",changeSearchText,false);

		inrcont.appendChild(document.createElement("br"));

		var selelem2 = document.createElement("select");
		inrcont.appendChild(selelem2);
		selelem2.setAttribute("class","selectclass");
		selelem2.setAttribute("id","tabselect"+i);

		createTabSelectedElement(selelem2, i);
		selelem2.addEventListener("change",clickTabSelected,false);
	}
	loadValue(idx);
}
function createTabSelectedElement(selelem, index){
    var elOptNew = document.createElement("option");
    elOptNew.text = "Foreground";
    elOptNew.value = "fore";
    selelem.add(elOptNew);

    var elOptNew2 = document.createElement("option");
    elOptNew2.text = "Background";
    elOptNew2.value = "back";
    selelem.add(elOptNew2);

    chrome.storage.local.get([selelem.id, "fore_back"], function(result) {
        var val = result[selelem.id];
        var flg = result["fore_back"] != null && result["fore_back"] !== undefined;
        if((val == "back")||(flg)){
            selelem.value = "back";
        }
    });
}
function clickTabSelected(e){
	var row = e.currentTarget;
	var obj = {};
	obj[row.id] = row.value;
	chrome.storage.local.set(obj);
}
function createSelectElement(selelem){
	for(var i = 0; i < searchenginary.length; i++){
	    var elOptNew = document.createElement("option");
	    elOptNew.text = searchnameary[i];
	    elOptNew.value = searchenginary[i];
	    selelem.add(elOptNew);
	}
}
function loadValue(idx){
	var keys = [];
	for(var i = idx; i < 8+idx; i++){
		keys.push("select"+i, "text"+i);
	}
	chrome.storage.local.get(keys, function(result){
		for(var i = idx; i < 8+idx; i++){
			var lcsel = result["select"+i];
			if(lcsel){
				document.getElementById("select"+i).value = lcsel;
				if(lcsel == "Custom"){
					document.getElementById("text"+i).disabled = false;
				}
			}
			var lctxt = result["text"+i];
			if(lctxt){
				document.getElementById("text"+i).value = lctxt;
			}
			if(document.getElementById("select"+i).value == "Custom"){
				var txtval = document.getElementById("text"+i).value;
				if(checkDomain(txtval)){
					var url = txtval;
					var uary = url.split("/");
					var domain = uary[2];
					document.getElementById("favicon"+i).setAttribute("src",createFaviconURI(domain));
				}
			}else{
				var url = document.getElementById("select"+i).value;
				var uary = url.split("/");
				var domain = uary[2];
				document.getElementById("favicon"+i).setAttribute("src",createFaviconURI(domain));
			}
		}
	});
}
function checkDomain(url){
	url = url.replace(/^\s+|\s+$/g,"");
	if((url)&&(url.indexOf("//") != -1)){
		var uary = url.split("/");
		var domain = uary[2];
		var dlen = domain.length;
		if((domain)&&(domain.indexOf(".") != -1)&&(domain.indexOf(".") != dlen-1)){
			return true;
		}
	}
	return false;
}
function clickSearchSelect(e){
	var row = e.currentTarget;
	var id = row.id;
	id = id.substring(6);
	var obj = {};
	obj[row.id] = row.value;
	chrome.storage.local.set(obj);

	if(row.value == "Custom"){
		document.getElementById('text'+id).disabled = false;
			var txtval = document.getElementById("text"+id).value;
			if(checkDomain(txtval)){
				var url = txtval;
				var uary = url.split("/");
				var domain = uary[2];
				document.getElementById("favicon"+id).setAttribute("src",createFaviconURI(domain));
				chrome.runtime.sendMessage({action: "setSearchEngine", id: id, se: url});
				chrome.runtime.sendMessage({action: "resendInfo"});
			}
	}else{
		document.getElementById('text'+id).disabled = true;
		var url = row.value;
		var uary = url.split("/");
		var domain = uary[2];
		document.getElementById("favicon"+id).setAttribute("src",createFaviconURI(domain));
		chrome.runtime.sendMessage({action: "setSearchEngine", id: id, se: url});
		chrome.runtime.sendMessage({action: "resendInfo"});
	}
	setChromeSync();
}
function changeSearchText(e){
	var row = e.currentTarget;
	var txt = row.value;
	var id = row.id;
	id = id.substring(4);

	txt = txt.replace(/^\s+|\s+$/g,"");
	if(txt){
		clearTimeout(changetextTimerid);
		changetextTimerid = setTimeout(function(){
			var txtval = txt;
			if(checkDomain(txtval)){
				var obj = {};
				obj[row.id] = txt;
				chrome.storage.local.set(obj);
				row.style.background = "";
				row.style.color = "";
				var url = txtval;
				var uary = url.split("/");
				var domain = uary[2];
				document.getElementById("favicon"+id).setAttribute("src",createFaviconURI(domain));
				chrome.runtime.sendMessage({action: "setSearchEngine", id: id, se: url});
				chrome.runtime.sendMessage({action: "resendInfo"});
				setChromeSync();
			}else{
				row.style.background = "#990000";
				row.style.color = "#ffffff";
			}
		},2500);
	}
}
function obj2opt(optobj){
	var storageObj = {};
    for(var i = 0; i < 8; i++){
    	var se = optobj["se"+i];
        if(se){
	        storageObj["se"+i] = se;
        }
    	se = optobj["select"+i];
        if(se){
	        storageObj["select"+i] = se;
        }
    	se = optobj["text"+i];
        if(se){
	        storageObj["text"+i] = se;
        }
    	se = optobj["tabselect"+i];
        if(se){
	        storageObj["tabselect"+i] = se;
        }
    }
    for(var i = 10; i < 18; i++){
    	var se = optobj["se"+i];
        if(se){
	        storageObj["se"+i] = se;
        }
    	se = optobj["select"+i];
        if(se){
	        storageObj["select"+i] = se;
        }
    	se = optobj["text"+i];
        if(se){
	        storageObj["text"+i] = se;
        }
    	se = optobj["tabselect"+i];
        if(se){
	        storageObj["tabselect"+i] = se;
        }
    }
	var dval = optobj["detect_value"];
	if(dval){
		storageObj["detect_value"] = dval;
	}
	if(optobj["tab_pos"]){
		storageObj["tab_pos"] = "after";
	}
	if(optobj["fore_back"]){
		storageObj["fore_back"] = "back";
	}

	chrome.storage.local.set(storageObj, function(){
		var sddmode = optobj["sddmode"];
		if(sddmode == "drop"){
			chrome.runtime.sendMessage({action: "setSearchMode", val1: true, val2: false});
			chrome.storage.local.set({"search_mode": "drop"});
			chrome.storage.local.remove("favicon_mode");
		}else if(sddmode == "arrow"){
			chrome.runtime.sendMessage({action: "setSearchMode", val1: false, val2: false});
			chrome.storage.local.remove("search_mode");
			chrome.storage.local.remove("favicon_mode");
		}else if(sddmode == "favicon"){
			chrome.runtime.sendMessage({action: "setSearchMode", val1: false, val2: true});
			chrome.storage.local.remove("search_mode");
			chrome.storage.local.set({"favicon_mode": "favicon"});
		}
		chrome.runtime.sendMessage({action: "loadOptions"});
		chrome.runtime.sendMessage({action: "resendInfo"});
		location.reload();
	});
}
function clickExportButton(){
    var msel = document.getElementById("modeselect");
    chrome.runtime.sendMessage({action: "opt2obj", mselval: msel.value}, function(response){
        if(response && response.result){
            saveAllowText(JSON.stringify(response.result),"sdd_export.txt");
        }
    });
}
function saveAllowText(text, filename) {
    var a = document.createElement('a');
    a.href = 'data:text/plain,' + encodeURIComponent(text);
    a.download = filename;
	var types = ['click'];
	for ( var i = 0, l = types.length; i < l; i++){
		var clicker = new MouseEvent(types[i], {
		  'bubbles': true,
		  'cancelable': true,
		  'view': window,
		  'detail': 0,
		  'screenX': 0,
		  'screenY': 0,
		  'clientX': 0,
		  'clientY': 0,
		  'ctrlKey': false,
		  'altKey': false,
		  'shiftKey': false,
		  'metaKey': false,
		  'button': 0,
		  'relatedTarget': null
		});
		a.dispatchEvent(clicker);
	}
}
function clickImportButton(){
    document.getElementById("hiddenfilebutton").click();
}
function fileHandler(e){
    var file = this.files[0];
    if((file.type == "text/plain")||(file.type.indexOf("javascript"))){
        var fr = new FileReader();
        fr.onload = function () {
            var txtobj = fr.result;
            var optobj = JSON.parse(txtobj);
            if(optobj.daffunda){
            	obj2opt(optobj);
            }
        };
        fr.readAsText(file);
    }
}
function loadSearchEngineMenu(){
	searchenginary[0] = "https://www.google.com/search?q=";
	searchenginary[1] = "https://www.google.com/search?tbm=isch&q=";
	searchenginary[2] = "https://maps.google.com/maps?q=";
	searchenginary[3] = "https://www.google.com/search?tbm=vid&q=";
	searchenginary[4] = "https://mail.google.com/mail/?fs=1&tf=1&source=ig&view=cm&to=&cc=&bcc=&su=&body=";
	searchenginary[5] = 'https://www.google.com/search?tbs=qdr:h&q=';
	searchenginary[6] = 'https://www.google.com/search?tbs=qdr:d&q=';
	searchenginary[7] = 'https://www.google.com/search?tbs=qdr:w&q=';
	searchenginary[8] = 'https://www.google.com/search?tbs=qdr:m&q=';
	searchenginary[9] = 'https://www.google.com/search?tbs=qdr:m3&q=';
	searchenginary[10] = 'https://www.google.com/search?tbs=qdr:m6&q=';
	searchenginary[11] = 'https://www.google.com/search?tbs=qdr:y&q=';
	searchenginary[12] = 'http://webcache.googleusercontent.com/search?q=cache:';
	searchenginary[13] = "https://www.youtube.com/results?search_query=";
	searchenginary[14] = "https://www.youtube.com/results?filters=long&lclk=long&search_query=";
	searchenginary[15] = "https://www.youtube.com/results?filters=playlist&lclk=playlist&search_query=";
	searchenginary[16] = "https://en.wikipedia.org/wiki/";
	searchenginary[17] = "https://twitter.com/search?f=realtime&q=";
	searchenginary[18] = "https://vine.co/search/";
	searchenginary[19] = "http://www.tumblr.com/tagged/";
	searchenginary[20] = "http://www.pinterest.com/search/pins/?q=";
	searchenginary[21] = "http://www.reddit.com/search?q=";
	searchenginary[22] = "http://digg.com/search?q=";
	searchenginary[23] = "http://www.baidu.com/s?wd=";
	searchenginary[24] = "http://www.bing.com/search?q=";
	searchenginary[25] = "https://duckduckgo.com/?q=";
	searchenginary[26] = "http://www.imdb.com/find?q=";
	searchenginary[27] = "http://stackoverflow.com/search?q=";
	searchenginary[28] = "https://www.flickr.com/search/?q=";
	searchenginary[29] = "http://search.yahoo.com/search?p=";
	searchenginary[30] = "http://yandex.ru/yandsearch?text=";
	searchenginary[31] = "http://images.yandex.ru/yandsearch?text=";
	searchenginary[32] = "http://yandex.ru/video/search?text=";
	searchenginary[33] = "http://b.hatena.ne.jp/search/text?safe=off&sort=popular&q=";
	searchenginary[34] = "http://search.naver.com/search.naver?query=";
	searchenginary[35] = 'http://www.onelook.com/?w=';
	searchenginary[36] = 'http://search.azlyrics.com/search.php?q=';
	searchenginary[37] = "Custom";
	searchenginary[38] = "http://OpenURL.open/";
	searchenginary[39] = "http://Clipboard.Clipboard/";
	searchenginary[40] = "http://Textfile.Textfile/";
	searchenginary[41] = "http://Memo.Memo/";
	searchenginary[42] = "http://Speech.Speech/";

	searchnameary[0] = "Google";
	searchnameary[1] = "Google Images";
	searchnameary[2] = "Google Maps";
	searchnameary[3] = "Google Video";
	searchnameary[4] = "Gmail";
	searchnameary[5] = "Google(Past hour)";
	searchnameary[6] = "Google(Past 24h)";
	searchnameary[7] = "Google(Past week)";
	searchnameary[8] = "Google(Past month)";
	searchnameary[9] = "Google(Past 3m)";
	searchnameary[10] = "Google(Past 6m)";
	searchnameary[11] = "Google(Past year)";
	searchnameary[12] = "Google Cache";
	searchnameary[13] = "Youtube";
	searchnameary[14] = "Youtube Long";
	searchnameary[15] = "Youtube Playlist";
	searchnameary[16] = "Wikipedia";
	searchnameary[17] = "Twitter";
	searchnameary[18] = "Vine";
	searchnameary[19] = "Tumblr";
	searchnameary[20] = "Pinterest";
	searchnameary[21] = "Reddit";
	searchnameary[22] = "Digg";
	searchnameary[23] = "Baidu";
	searchnameary[24] = "Bing";
	searchnameary[25] = "DuckDuckGo";
	searchnameary[26] = "IMDb";
	searchnameary[27] = "Stackoverflow";
	searchnameary[28] = "Flickr";
	searchnameary[29] = "Yahoo";
	searchnameary[30] = "Yandex";
	searchnameary[31] = "Yandex	Images";
	searchnameary[32] = "Yandex	Videos";
	searchnameary[33] = "Hatena Bookmark";
	searchnameary[34] = "NAVER";
	searchnameary[35] = "OneLook Dictionary";
	searchnameary[36] = "AZLyrics";
	searchnameary[37] = "Custom";
	searchnameary[38] = "Open URL";
	searchnameary[39] = "Clipboard";
	searchnameary[40] = "Text File";
	searchnameary[41] = "Memo";
	searchnameary[42] = "Text To Speech(TTS required)";
}
function createFaviconURI(domainstr){
	if(domainstr){
		if(domainstr.indexOf("www.google.com") > -1){
			return googlefav;
		}else if(domainstr.indexOf("maps.google.com") > -1){
			return gglmapfav;
		}else if(domainstr.indexOf("mail.google.com") > -1){
			return gmailfav;
		}else if(domainstr.indexOf("webcache.googleusercontent.com") > -1){
			return googlefav;
		}else if(domainstr.indexOf("www.youtube.com") > -1){
			return youtubefav;
		}else if(domainstr.indexOf(".wikipedia.org") > -1){
			return wikifav;
		}else if(domainstr.indexOf("twitter.com") > -1){
			return twitterfav;
		}else if(domainstr.indexOf("www.tumblr.com") > -1){
			return tumblrfav;
		}else if(domainstr.indexOf("www.baidu.com") > -1){
			return baidufav;
		}else if(domainstr.indexOf("www.bing.com") > -1){
			return bingfav;
		}else if(domainstr.indexOf("duckduckgo.com") > -1){
			return duckfav;
		}else if(domainstr.indexOf("www.imdb.com") > -1){
			return imdbfav;
		}else if(domainstr.indexOf("stackoverflow.com") > -1){
			return stackfav;
		}else if(domainstr.indexOf("www.flickr.com") > -1){
			return flickrfav;
		}else if(domainstr.indexOf(".amazon.") > -1){
			return amazonfav;
		}else if(domainstr.indexOf(".naver.") > -1){
			return naverfav;
		}else if(domainstr.indexOf("yandex.ru") > -1){
			return yandexfav;
		}else if(domainstr.indexOf(".yahoo.com") > -1){
			return yahoofav;
		}else if(domainstr.indexOf("b.hatena.ne.jp") > -1){
			return hatenafav;
		}else if(domainstr.indexOf("vine.co") > -1){
			return vinefav;
		}else if(domainstr.indexOf("www.pinterest.com") > -1){
			return pintfav;
		}else if(domainstr.indexOf("www.reddit.com") > -1){
			return redditfav;
		}else if(domainstr.indexOf("digg.com") > -1){
			return diggfav;
		}else if(domainstr.indexOf("images.yandex.ru") > -1){
			return yanimgfav;
		}else if(domainstr.indexOf("www.onelook.com") > -1){
			return onefav;
		}else if(domainstr.indexOf("search.azlyrics.com") > -1){
			return azfav;
		}else if(domainstr.indexOf("OpenURL.open") == 0){
			return rightfav;
		}else if(domainstr.indexOf("Clipboard.Clipboard") == 0){
			return clipbfav;
		}else if(domainstr.indexOf("Textfile.Textfile") == 0){
			return txtfav;
		}else if(domainstr.indexOf("Memo.Memo") == 0){
			return memofav;
		}else if(domainstr.indexOf("Speech.Speech") == 0){
			return speechfav;
		}else{
			return "http://www.google.com/s2/favicons?domain="+domainstr;
		}
	}
	return "";
}
var baidufav = chrome.runtime.getURL('favicon/baidu.png');
var bingfav = chrome.runtime.getURL('favicon/bing.png');
var duckfav = chrome.runtime.getURL('favicon/duckduckgo.png');
var flickrfav = chrome.runtime.getURL('favicon/flickr.png');
var gmailfav = chrome.runtime.getURL('favicon/gmail.png');
var googlefav = chrome.runtime.getURL('favicon/google.png');
var gglmapfav = chrome.runtime.getURL('favicon/googlemaps.png');
var imdbfav = chrome.runtime.getURL('favicon/imdb.png');
var stackfav = chrome.runtime.getURL('favicon/stackoverflow.png');
var tumblrfav = chrome.runtime.getURL('favicon/tumblr.png');
var twitterfav = chrome.runtime.getURL('favicon/twitter.png');
var wikifav = chrome.runtime.getURL('favicon/wikipedia.png');
var youtubefav = chrome.runtime.getURL('favicon/youtube.png');
var amazonfav = chrome.runtime.getURL('favicon/amazon.png');
var naverfav = chrome.runtime.getURL('favicon/naver.png');
var yandexfav = chrome.runtime.getURL('favicon/yandex.png');
var yahoofav = chrome.runtime.getURL('favicon/yahoo.png');
var hatenafav = chrome.runtime.getURL('favicon/hatena.png');
var rightfav = chrome.runtime.getURL('favicon/right.png');
var clipbfav = chrome.runtime.getURL('favicon/clip.png');
var vinefav = chrome.runtime.getURL('favicon/vine.png');
var pintfav = chrome.runtime.getURL('favicon/pint.png');
var redditfav = chrome.runtime.getURL('favicon/reddit.png');
var diggfav = chrome.runtime.getURL('favicon/digg.png');
var yanimgfav = chrome.runtime.getURL('favicon/yanimg.png');
var onefav = chrome.runtime.getURL('favicon/one.png');
var azfav = chrome.runtime.getURL('favicon/az.png');
var txtfav = chrome.runtime.getURL('favicon/textfile.png');
var memofav = chrome.runtime.getURL('favicon/memo.png');
var speechfav = chrome.runtime.getURL('favicon/speech.png');
