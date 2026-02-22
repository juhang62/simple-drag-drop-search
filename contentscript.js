var excpetoptionarray = [];
var host = location.protocol+"//"+location.hostname+location.pathname;
var X,Y;
var TYPE = null;
var DATA = null;
var XVAL = 70;
var YVAL = 70;
var tilemode = false;
var iframeflag = (window != window.parent);
var createtileflag = false;
var onmessageflag = false;
var faviconmode = false;
var tileshiftflag = false;
var mousedownflag = false;
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
var sengineary = [];
var sedomginary = [];
createArray(searray);

window.addEventListener("DOMContentLoaded",function(){
	createInfoElement();
	document.addEventListener("dragstart",startDrag,false);
	document.addEventListener("drag",onDrag,false);
	document.addEventListener('dragover', preventEvent,false);
	document.addEventListener('dragenter', preventEvent,false);
	document.addEventListener('drop', onDrop,false);
	window.addEventListener('dragend', onDragEnd,true);
	document.addEventListener('mouseup',getSelectText,false);
	document.addEventListener('mousedown',mouseDown,false);
	document.addEventListener('mousemove',mouseMove,false);
	document.addEventListener('keydown',hideFaviconBox,false);
	document.addEventListener('dblclick',dlbclickText,false);
	chrome.storage.local.get("_except_url_",function(obj){
	    if(obj&&obj["_except_url_"]){
        	var eurlary = obj["_except_url_"];
    		for(var i = 0; i < eurlary.length; i++){
    			excpetoptionarray.push(eurlary[i]);
    		}
	    }
	});
},false);
window.addEventListener("copy",getCopy,true);
function getCopy(e){
	var sel = window.getSelection().toString();
	chrome.runtime.sendMessage({snd: "selecttxt", seltxt: sel});
}
function mouseDown(e){
	mousedownflag = true;
}
function mouseMove(e){
	if(mousedownflag){
		var selection = window.getSelection();
		var dtxt = selection.toString();
		if(dtxt){
			chrome.runtime.sendMessage(null,{msg: "wakup"});
		}
	}
}
function dlbclickText(e){
	if(faviconmode){
		setTimeout(function(){
			var selection = window.getSelection();
			var dtxt = selection.toString();
			dtxt = dtxt.replace(/\r?\n/g, " ");
			dtxt = dtxt.replace(/^\s+|\s+$/g,"");
			if(dtxt){
				createFaviconBox(e,dtxt);
			}
		},300);
	}else{
		hideFaviconBox();
	}
}
function getSelectText(e){
	mousedownflag = false;	
	if(!checkExceptList(host,excpetoptionarray)){
    	setTimeout(function(){
    		chrome.runtime.sendMessage({stat:"init"},function(request){
    			var selection = window.getSelection();
    			var dtxt = selection.toString();
    			dtxt = dtxt.replace(/\r?\n/g, " ");
    			dtxt = dtxt.replace(/^\s+|\s+$/g,"");
    			if(dtxt){
    				if(!onmessageflag){
    					onmessageflag = true;
    					var valobj = request.val;
    					XVAL = valobj.x;
    					YVAL = valobj.y;
    					var sary = request.sengin;
    					tilemode = request.mode;
    					faviconmode = request.fm;
    					createArray(sary);
    				}
    				if((e.button == 0)&&(faviconmode)){
    					createFaviconBox(e,dtxt);
    				}else{
    					hideFaviconBox();
    				}
    			}else{
    				hideFaviconBox();
    			}
    		});
    	},250);
	}
}
function hideFaviconBox(){
	var favb = document.getElementById("faviconboxsddssdds");
	if(favb){
		document.body.removeChild(favb);
	}
}
function createFaviconBox(e,dtxt){
	hideFaviconBox();

	var favcont = document.createElement("div");
	document.body.appendChild(favcont);
	favcont.setAttribute("id","faviconboxsddssdds");
	favcont.style.position = "fixed";
	favcont.style.padding = 0;
	favcont.style.margin = 0;
	favcont.style.lineHeight = 1;
	favcont.style.display = "block";
	favcont.style.background = "#dfefff";
	favcont.style.border = "1px solid #0000ff";
	favcont.style.zIndex = 0x7FFFFFFF;
	favcont.style.fontSize = "16px";
	createFaviconButton(favcont,dtxt,0);

	var lval = e.clientX;
	var tval = e.clientY;
	var winwidth = e.view.innerWidth;
	var winheight = e.view.innerHeight;
	var boxheight = favcont.offsetHeight +25;
	var boxwidth = favcont.offsetWidth +25;

	if((lval+boxwidth) >= winwidth){
		lval = winwidth - boxwidth-20;
	}
	if((tval+boxheight) >= winheight){
		tval = winheight - boxheight-20;
	}

	favcont.style.top = tval+20+"px";
	favcont.style.left = lval+20+"px";
}
function createFaviconButton(favcont,dtxt,idx){
	favcont.innerHTML = "";
	for(var i = idx; i < idx+9; i++){
		var favimg = document.createElement("img");
		favcont.appendChild(favimg);
		favimg.style.setProperty('display', 'inline-block', 'important');
		favimg.style.width = "16px";
		favimg.style.height = "16px";
		favimg.style.padding = "3px";
		favimg.style.lineHeight = "16px";
		favimg.style.boxSizing = "content-box";
		favimg.style.letterSpacing = 0;
		favimg.style.borderWidth = 0;
		favimg.style.margin = 0;
		if((i != 4)&&(i != 14)){
			favimg.setAttribute("src",createFaviconURI(sedomginary[i]));
			if(sengineary[i] == "http://OpenURL.open/"){
				favimg.setAttribute("title","Open URL");
			}else if(sengineary[i] == "http://Clipboard.Clipboard/"){
				favimg.setAttribute("title","Clipboard");
			}else if(sengineary[i] == "http://Textfile.Textfile/"){
				favimg.setAttribute("title","to Text File");
			}else if(sengineary[i] == "http://Memo.Memo/"){
				favimg.setAttribute("title","Memo");
			}else if(sengineary[i] == "http://Speech.Speech/"){
				favimg.setAttribute("title","Speech");
			}else{
				favimg.setAttribute("title",sengineary[i]);
			}
			favimg.index = i;
			favimg.addEventListener("mouseover",startHoverImage,false);
			favimg.addEventListener("mouseout",endHoverImage,false);
			favimg.addEventListener("mousedown",function(e){
				var force = false;
				if(e.button == 2){
					force = true;
					document.addEventListener("contextmenu",disableContext,true);
				}
				mouseDownFavicon(e,dtxt,force);
				this.style.background = "red";
				var that = this;
				setTimeout(function(){
					that.style.background = "";
				},300);
			},false);
			favimg.addEventListener("mouseup",mouseUpFavicon,true);

			if((i == 2)||(i == 5)||(i == 8)||(i == 12)||(i == 15)||(i == 18)){
				var brelm = document.createElement("br");
				favcont.appendChild(brelm);
			}
		}else{
			favimg.setAttribute("src",spng);
			favimg.setAttribute("title","Shift");
			favimg.addEventListener("mouseover",startHoverImage,true);
			favimg.addEventListener("mouseout",endHoverImage,true);
			favimg.addEventListener("mouseup",mouseUpFavicon,true);
			favimg.addEventListener("mousedown",function(e){
				e.preventDefault();
				e.stopPropagation();
				if(idx == 0){
					createFaviconButton(favcont,dtxt,10);
				}else{
					createFaviconButton(favcont,dtxt,0);
				}
			},true);
		}
	}
	var ttldiv = document.createElement("div");
	favcont.appendChild(ttldiv);
	ttldiv.style.height = "12px";
	ttldiv.style.textAlign = "center";
	ttldiv.style.background = "#000";
	ttldiv.style.color = "#ccc";
	ttldiv.style.fontSize = "11px";
	ttldiv.style.padding = 0;
	ttldiv.style.margin = 0;
	ttldiv.style.cursor = "pointer";
	ttldiv.textContent = "Options";
	ttldiv.addEventListener("mousedown",function(e){
		e.preventDefault();
		e.stopPropagation();
		chrome.runtime.sendMessage({msg: "options"});
	},true);
}
function disableContext(evt){
    evt.preventDefault();
    evt.stopPropagation();
	document.removeEventListener("contextmenu",disableContext,true);
}
function startHoverImage(e){
	var row = e.currentTarget;
	row.style.background = "orange";
}
function endHoverImage(e){
	var row = e.currentTarget;
	row.style.background = "";
}
function mouseDownFavicon(e,dtxt,force){
	if(dtxt){
		var row = e.currentTarget;
		chrome.runtime.sendMessage({stat: "search", data: dtxt, se: sengineary[row.index], idx: row.index,force:force});
	}
}
function mouseUpFavicon(e){
	e.preventDefault();
	e.stopPropagation();
}
function createInfoElement(){
	var sbar = document.createElement("img");
	document.body.appendChild(sbar);
	sbar.setAttribute("id","sddsExtensionInfoImg");
	sbar.style.display = "none";
	sbar.style.position = "absolute";
	sbar.style.top = 0;
	sbar.style.left = 0;
	sbar.style.width = "32px";
	sbar.style.height = "32px";
	sbar.style.zIndex = 0x7FFFFFFF;

	var arrw = document.createElement("img");
	document.body.appendChild(arrw);
	arrw.setAttribute("id","sddsExtensionArrowImg");
	arrw.style.display = "none";
	arrw.style.position = "absolute";
	arrw.style.top = 0;
	arrw.style.left = 0;
	arrw.style.width = "32px";
	arrw.style.height = "32px";
	arrw.style.zIndex = 0x7FFFFFFF;
}
function createTile(idx){
	var left = 0;
	var top = 0;
	var winwidth = window.innerWidth;
	var winheight = window.innerHeight;
	var itemwidth = Math.floor(winwidth/3) -3;
	var itemheigth = Math.floor(winheight/3) -3;

	var oldtile = document.getElementById("sddsExtensiontilecontainer");
	if(oldtile){
		document.body.removeChild(oldtile);
	}
	var tilecont = document.createElement("div");
	document.body.appendChild(tilecont);
	tilecont.setAttribute("id","sddsExtensiontilecontainer");
	tilecont.style.position = "fixed";
	tilecont.style.left = 0;
	tilecont.style.top = 0;
	tilecont.style.width = "100%";
	tilecont.style.height = "100%";
	tilecont.style.zIndex = 0x7FFFFFFF;

	for(var i = idx; i < idx+9; i++){
		if((i == 3)||(i == 6)||(i == 13)||(i == 16)){
			left = 0;
			top += itemheigth;
		}
		if((i != 4)&&(i != 14)){
			var ddcont = document.createElement("div");
			tilecont.appendChild(ddcont);
			ddcont.style.position = "fixed";
			ddcont.style.left = left+"px";
			ddcont.style.top = top+"px";
			ddcont.style.width = itemwidth+"px";
			ddcont.style.height = itemheigth+"px";
			ddcont.style.background = 'rgba(0,0,255,0.5)';
			ddcont.index = i;

			if((i == 1)||(i == 7)||(i == 11)||(i == 17)){
				ddcont.style.borderLeft = "1px solid #bbb";
				ddcont.style.borderRight = "1px solid #bbb";
			}
			ddcont.addEventListener("dragover",dragEnterTile,false);
			ddcont.addEventListener("dragleave",dragLeaveTile,false);
			ddcont.addEventListener("drop",function(e){drapTile(e,sengineary)},true);

			var ddsubcont = document.createElement("div");
			ddcont.appendChild(ddsubcont);
			ddsubcont.style.fontSize = "15px";
			ddsubcont.style.fontWeight = "bold";
			ddsubcont.style.background = 'rgba(0,0,0,1)';
			ddsubcont.style.color = "white";	
			ddsubcont.style.textAlign = "center";
			ddsubcont.style.padding = "8px 0";

			var favcn = document.createElement("img");
			ddsubcont.appendChild(favcn);
			favcn.setAttribute("src",createFaviconURI(sedomginary[i]));
			favcn.style.verticalAlign = "middle";
			favcn.style.marginRight = "5px";
			if(sedomginary[i] == "OpenURL.open"){
				ddsubcont.appendChild(document.createTextNode("Open URL"));
			}else if(sedomginary[i] == "Clipboard.Clipboard"){
				ddsubcont.appendChild(document.createTextNode("Clipboard"));
			}else if(sedomginary[i] == "Textfile.Textfile"){
				ddsubcont.appendChild(document.createTextNode("to Text File"));
			}else if(sedomginary[i] == "Memo.Memo"){
				ddsubcont.appendChild(document.createTextNode("Memo"));
			}else if(sedomginary[i] == "Speech.Speech"){
				ddsubcont.appendChild(document.createTextNode("Speech"));
			}else{
				ddsubcont.appendChild(document.createTextNode(sedomginary[i]));
			}
		}
		left += itemwidth;
	}
}
function dragEnterTile(e){
	var row = e.currentTarget;
	row.style.background = 'rgba(200,0,0,0.5)';
}
function dragLeaveTile(e){
	var row = e.currentTarget;
	row.style.background = 'rgba(0,0,255,0.5)';
}
function drapTile(e,sengineary){
	if(DATA){
		var row = e.currentTarget;
		row.style.background = 'rgba(0,0,255,0.5)';
		chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[row.index], idx: row.index});
	}
	onDragEnd();
}
function removeTileItems(){
	var tilecont = document.getElementById("sddsExtensiontilecontainer");
	if(tilecont){
		document.body.removeChild(tilecont);
	}
}
function preventEvent(e){ 
	e.preventDefault();	
}
function startDrag(e){
	if(!faviconmode){
		X = e.pageX;
		Y = e.pageY;
		TYPE = e.srcElement.nodeName;

		if(TYPE == "IMG"){
			DATA = e.srcElement.alt;
		}else{
			TYPE = "TEXT";
			var selection = window.getSelection();
			DATA = selection.toString();
			if(DATA){
				DATA = DATA.replace(/\r?\n/g, " ");
				DATA = DATA.replace(/^\s+|\s+$/g,"");
			}
		}
	}else{
		hideFaviconBox();
	}
}
function onDrag(e){
	if(checkExceptList(host,excpetoptionarray))return;
	if(!faviconmode){
		if((tilemode)&&(!iframeflag)){
			if(((!createtileflag)&&(DATA))||(tileshiftflag != e.shiftKey)){
				createtileflag = true;
				if(e.shiftKey){
					createTile(10);
				}else{
					createTile(0);
				}
				tileshiftflag = e.shiftKey;
			}
		}else{
			if((DATA)&&(X > 0)&&(Y > 0)){
				if(TYPE == "IMG"){
				}else{
					var idx = 0;
					if(e.shiftKey){
						idx = 10;
					}
					var posobj = checkPostion(e);
					var infoimg = document.getElementById("sddsExtensionInfoImg");
					var arrwimg = document.getElementById("sddsExtensionArrowImg");
					if(arrwimg){
					    arrwimg.style.display = "inline-block";
					    arrwimg.style.top = Y+"px";
					    arrwimg.style.left = X+"px";
					}
			    	if((posobj.x)&&(posobj.y)){
			    		if(posobj.x == "left"){
			    			if(posobj.y == "up"){
							    arrwimg.setAttribute("src",lupng);
			    				showFaviconImage(sedomginary[idx+0],e,infoimg);
			    			}else{
							    arrwimg.setAttribute("src",ldpng);
			    				showFaviconImage(sedomginary[idx+6],e,infoimg);
			    			}
			    		}else{
			    			if(posobj.y == "up"){
							    arrwimg.setAttribute("src",rupng);
			    				showFaviconImage(sedomginary[idx+2],e,infoimg);
			    			}else{
							    arrwimg.setAttribute("src",rdpng);
			    				showFaviconImage(sedomginary[idx+8],e,infoimg);
			    			}
			    		}
			    	}else if(posobj.x){
			    		if(posobj.x == "left"){
						    arrwimg.setAttribute("src",lpng);
		    				showFaviconImage(sedomginary[idx+3],e,infoimg);
			    		}else{
						    arrwimg.setAttribute("src",rpng);
		    				showFaviconImage(sedomginary[idx+5],e,infoimg);
			    		}
			    	}else if(posobj.y){
			    		if(posobj.y == "up"){
						    arrwimg.setAttribute("src",upng);
		    				showFaviconImage(sedomginary[idx+1],e,infoimg);
			    		}else{
						    arrwimg.setAttribute("src",dpng);
		    				showFaviconImage(sedomginary[idx+7],e,infoimg);
			    		}
				    }else{
				        infoimg.style.display = "none";
	    			    arrwimg.style.display = "none";
				    }
				}
			}
		}
	}
}
function onDrop(e){
	if(checkExceptList(host,excpetoptionarray))return;
	if(!faviconmode){
		createtileflag = false;
		if(!tilemode){
			var elemType = window.document.activeElement.type;
			if((elemType != "text") && (elemType != "textarea")){
				if((DATA)&&(X > 0)&&(Y > 0)){
					if(TYPE == "IMG"){
					}else{
						var add = 0;
						if(e.shiftKey){
							add = 10;
						}
						var posobj = checkPostion(e);
				    	if((posobj.x)&&(posobj.y)){
				    		if(posobj.x == "left"){
				    			if(posobj.y == "up"){
									chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+0], idx: add+0});
				    			}else{
									chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+6], idx: add+6});
				    			}
				    		}else{
				    			if(posobj.y == "up"){
									chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+2], idx: add+2});
				    			}else{
									chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+8], idx: add+8});
				    			}
				    		}
				    	}else if(posobj.x){
				    		if(posobj.x == "left"){
								chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+3], idx: add+3});
				    		}else{
								chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+5], idx: add+5});
				    		}
				    	}else if(posobj.y){
				    		if(posobj.y == "up"){
								chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+1], idx: add+1});
				    		}else{
								chrome.runtime.sendMessage({stat: "search", data: DATA, se: sengineary[add+7], idx: add+7});
				    		}
					    }
					}
				}
			}
		}
	}
	onDragEnd();		
}
function onDragEnd(){
	mousedownflag = false;
	createtileflag = false;
	var info = document.getElementById("sddsExtensionInfoImg");
	if(info){
		info.style.display = "none";
	}
	var arrow = document.getElementById("sddsExtensionArrowImg");
	if(arrow){
		arrow.style.display = "none";
	}
	removeTileItems();
}
function showFaviconImage(srchengine,e,infoimg){
	var x = e.pageX;
	var y = e.pageY;	
    infoimg.style.display = "inline-block";
    infoimg.style.top = y+25+"px";
    infoimg.style.left = x+"px";
	infoimg.setAttribute("src",createFaviconURI(srchengine));
}
function checkPostion(e){
	var x = e.pageX;
	var y = e.pageY;
	var xflg = null;
	var yflg = null;
	var posobj = {};

	if(y >= (Y+YVAL)){
		yflg = "down";
	}else if(y <= (Y-YVAL)){
		yflg = "up";
	}
	if(x >= (X+XVAL)){
		xflg = "right";
	}else if(x <= (X-XVAL)){
		xflg = "left";
	}
	posobj.x = xflg;
	posobj.y = yflg;
	return posobj;
}
function checkDomain(urlstr){
	if(urlstr.indexOf("//") > -1){
		var urlary = urlstr.split("/");
		var scrdomain = urlary[2];
		if(scrdomain){
			if(scrdomain.indexOf(".") > 0){
				return scrdomain;
			}
		}
	}
	return "";
}
function createArray(ary){
	sengineary.length = 0;
	sengineary.push(ary[0]);
	sengineary.push(ary[1]);
	sengineary.push(ary[2]);
	sengineary.push(ary[3]);
	sengineary.push("center");
	sengineary.push(ary[4]);
	sengineary.push(ary[5]);
	sengineary.push(ary[6]);
	sengineary.push(ary[7]);
	sengineary.push("");

	sengineary.push(ary[10]);
	sengineary.push(ary[11]);
	sengineary.push(ary[12]);
	sengineary.push(ary[13]);
	sengineary.push("center");
	sengineary.push(ary[14]);
	sengineary.push(ary[15]);
	sengineary.push(ary[16]);
	sengineary.push(ary[17]);

	sedomginary.length = 0;
	sedomginary.push(checkDomain(sengineary[0]));
	sedomginary.push(checkDomain(sengineary[1]));
	sedomginary.push(checkDomain(sengineary[2]));
	sedomginary.push(checkDomain(sengineary[3]));
	sedomginary.push("center");
	sedomginary.push(checkDomain(sengineary[5]));
	sedomginary.push(checkDomain(sengineary[6]));
	sedomginary.push(checkDomain(sengineary[7]));
	sedomginary.push(checkDomain(sengineary[8]));
	sedomginary.push("");

	sedomginary.push(checkDomain(sengineary[10]));
	sedomginary.push(checkDomain(sengineary[11]));
	sedomginary.push(checkDomain(sengineary[12]));
	sedomginary.push(checkDomain(sengineary[13]));
	sedomginary.push("center");
	sedomginary.push(checkDomain(sengineary[15]));
	sedomginary.push(checkDomain(sengineary[16]));
	sedomginary.push(checkDomain(sengineary[17]));
	sedomginary.push(checkDomain(sengineary[18]));
}
var upng = chrome.runtime.getURL('u.png');
var lupng = chrome.runtime.getURL('lu.png');
var rupng = chrome.runtime.getURL('ru.png');
var dpng = chrome.runtime.getURL('d.png');
var ldpng = chrome.runtime.getURL('ld.png');
var rdpng = chrome.runtime.getURL('rd.png');
var lpng = chrome.runtime.getURL('l.png');
var rpng = chrome.runtime.getURL('r.png');
var spng = chrome.runtime.getURL('s.png');

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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg == "speaking"){
		if(self==top){
			var txt = request.data;
			var list = request.vlist;
			var lang = document.documentElement.lang;
			if(!lang){
				lang = document.querySelector('meta[http-equiv="Content-Language"]');
				if(lang){
					lang = lang.getAttribute("content");
				}
			}
			if(!lang){
		        TTSObject.init(txt,"en-US");
			}else{
				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					var regex = new RegExp( lang, 'i' );
					if(item.match(regex)){
				        TTSObject.init(txt,item);
						return;
					}
				};
		        TTSObject.init(txt,"native");
		    }
		}
	}
});
TTSObject = {
	alltext:"",
	gettxtflg:true,
	timerid:null,
	speech : null,
	init:function(txt,lang){
		if(this.speech){
			this.stat(txt);
		}else{
			this.speech = new SpeechSynthesisUtterance();
			this.speech.volume = 1;
			this.speech.rate = 1;
			this.speech.pitch = 1;
			this.speech.text = "";
			this.speech.lang = lang;
			this.stat(txt);
		}
	},
	stat:function(txt){
		if(speechSynthesis.speaking){
			speechSynthesis.cancel();
		}
		this.parseTxt(txt);
	},
	parseTxt:function(txt){
		if(!this.lang){
			this.lang = "en-US";
		}
        txt = txt.replace(/(\r\n|\n|\r)/gm,'\r\n').replace(/(\r\n){2,}/gm,'\r\n').replace(/<("[^"]*"|'[^']*'|[^'">])*>/gm,'');
		if(this.lang === "en-US"){
			this.parseja(txt);
		}else{
			this.parseen(txt);
		}
	},
	parseen:function(str){
		var that = this;
		var ntxts = [];
		str = str.replace(/[\^\)\(\#\"\)\[\]\:\;\\\/\{\}\_\>\<]+/," ");
		var txts = str.split(/[\r\n\!\.\?\;\:\,]+/);
		var nary = [],nidx = 0,nstr = "";
		for (var i = 0; i < txts.length; i++) {
			var item = txts[i];
			item = item.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ');
			if(item){
				var len = item.length;
				if(len > 499){
				}else if(len > 0){
					ntxts.push(item);
				}
			}
		};
		that.statspeak(ntxts);
	},
	parseja:function(str){
		var that = this;
		var ntxts = [];
		str = str.replace(/[\^\)\(\#\"\)\[\]\:\;\\\/\{\}\_\>\<]+/," ");
		var txts = str.split(/[\!\?、。？！,.]+/);
		var nary = [],nidx = 0,nstr = "";
		for (var i = 0; i < txts.length; i++) {
			var item = txts[i];
			item = item.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ');
			if(item){
				var len = item.length;
				if(len > 499){
				}else if(len > 0){
					ntxts.push(item);
				}
			}
		};
		that.statspeak(ntxts);
	},
	statspeak:function(ntxts){
		var func = function(){
			idx++;
			if(ntxts[idx]){
				speechSynthesis.cancel()
				setTimeout(function(){
					that.speech.text = ntxts[idx];
					setTimeout(function(){
						speechSynthesis.speak(that.speech);
					},30);
				},20);
			}
		};
		var that = this;
		var idx = 0;
		this.speech.text = ntxts[idx];
		this.speech.onend = function(e) {
			func();
		};
		this.speech.onerror = function(e) {
			func();
		};
		speechSynthesis.speak(this.speech);
	}
}
function checkExceptList(url,list){
	if(list&&list.length > 0){
		var len = list.length;
	    for(var i = 0; i < len; i++){
	    	var lurl = list[i].url;

	        var regex = new RegExp(lurl);
	        if (url.search(regex) != -1) {
	            return list[i];
	        }
		    if(lurl.match(/^(http|https):\/\/.+$/)){
		    	var idx = url.indexOf(lurl);
				if(idx == 0){
					return list[i];
				}
		    }else{
		    	var urlary = url.split("/");
		    	if(urlary[2]){
			    	var domain = urlary[2];
			    	var idx = domain.indexOf(lurl);
					if(idx == 0){
						return list[i];
					}
			        var regex = new RegExp(lurl);
			        if (domain.search(regex) != -1) {
			            return list[i];
			        }
		    	}
		    }
	    }
	}
    return null;
}

