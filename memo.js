var checktimerid = null;

window.addEventListener("keydown",keyParser,true);
window.addEventListener("load", function() {
	document.getElementById("saveimg").addEventListener("click",clickSaveButton,false);
	document.getElementById("saveimg").addEventListener("keydown",keydownImage,false);
	document.getElementById("delimg").addEventListener("click",clickDeleteButton,false);
	document.getElementById("delimg").addEventListener("keydown",keydownImage,false);
	document.getElementById("newimg").addEventListener("click",clickResetButton,false);
	document.getElementById("newimg").addEventListener("keydown",keydownImage,false);
	document.getElementById("closeimg").addEventListener("click",clickCloseButton,false);
	document.getElementById("closeimg").addEventListener("keydown",keydownImage,false);
	chrome.storage.local.get("text_memo", function(result){
		if(result["text_memo"]){
			document.getElementById("textarea").value = result["text_memo"];
		}
	});
	var selelem = document.getElementById("fileselect");
	createSelectList();
	selelem.addEventListener("change",changeSelect,false);
	resizeWindow();
	setTimeout(function(){
		resizeWindow();
	},300)
}, false);
window.addEventListener("resize",function(e){
	resizeWindow();
},false);
function resizeWindow(){
	var btncnt = document.getElementById("btncontainer");
	var bcnth = btncnt.offsetHeight;
	var memo = document.getElementById("textarea");
	memo.style.height = window.innerHeight-bcnth-8+"px";
}
function keyParser(e){
	var keycode = e.keyCode;
	if((keycode == 81)&&(e.ctrlKey)){
		e.preventDefault();
		e.stopPropagation ();
		window.close();
	}else if((keycode == 83)&&(e.ctrlKey)){
		e.preventDefault();
		e.stopPropagation ();
		document.getElementById("saveimg").click();
	}else if((keycode == 78)&&(e.ctrlKey)){
		e.preventDefault();
		e.stopPropagation ();
		document.getElementById("newimg").click();
	}else if((keycode == 68)&&(e.ctrlKey)){
		e.preventDefault();
		e.stopPropagation ();
		document.getElementById("delimg").click();
	}else if((keycode == 74)&&(e.ctrlKey)){
		e.preventDefault();
		e.stopPropagation ();
		selectDown();
	}else if((keycode == 75)&&(e.ctrlKey)){
		e.preventDefault();
		e.stopPropagation ();
		selectUp();
	}
}
function selectUp(){
	var selelem = document.getElementById("fileselect");
	var selindx = selelem.selectedIndex;
	var options = selelem.options;

	if(selindx == 0){
		selelem.selectedIndex = options.length-1;
	}else{
		selelem.selectedIndex = selindx-1;
	}
	changeSelect();
}
function selectDown(){
	var selelem = document.getElementById("fileselect");
	var selindx = selelem.selectedIndex;
	var options = selelem.options;

	if(selindx == options.length-1){
		selelem.selectedIndex = 0;
	}else{
		selelem.selectedIndex = selindx+1;
	}
	changeSelect();
}
function keydownImage(e){
	if(e.keyCode == 13){
		this.click();
	}
}
function changeSelect(){
	var selelem = document.getElementById("fileselect");
	var idx = selelem.selectedIndex;
	document.getElementById("textarea").value = selelem.options[idx].value;
	document.getElementById("nameinput").value = selelem.options[idx].text;
	document.getElementById("textarea").focus();
}
function clickSaveButton(){
	var txt = document.getElementById("textarea").value;
	if(txt){
	    txt = txt.replace(/^\s+|\s+$/g, "");
		var selelem = document.getElementById("fileselect");
		var seloptary = [];
		var selindx = selelem.selectedIndex;
		var nameinpt = document.getElementById("nameinput").value;
		nameinpt = nameinpt.replace(/(^\s+)|(\s+$)/g, "");
		if(!nameinpt){
			nameinpt = txt.substring(0,15);
		}
		var options = selelem.options;
		if(selindx != 0){
			options[selindx].text = nameinpt;
			options[selindx].value = txt;
		}
		for(var i = options.length-1; 0 < i; i--){
			var sobj = options[i];
			var oobj = {};
			oobj.txt = sobj.value;
			oobj.name = sobj.text;
			seloptary.push(oobj);
		}
		if(selindx == 0){
			var obj ={};
			obj.txt = txt;
			obj.name = nameinpt;
			seloptary.push(obj)
		}
		chrome.storage.local.set({"text_object": JSON.stringify(seloptary)});
		deleteSelectOption();
		createSelectList();
	}
	clickResetButton();
	document.getElementById("textarea").focus();
}
function createSelectList(){
	var selelem = document.getElementById("fileselect");
	chrome.storage.local.get("text_object", function(result){
		var json = result["text_object"];
		if(json){
			var txtobj = JSON.parse(json);
			for(var i = txtobj.length-1; -1 < i; i--){
				createSelectOption(txtobj[i].name,txtobj[i].txt,selelem);
			}
		}
		clickResetButton();
		document.getElementById("textarea").focus();
	});
}
function deleteSelectOption(){
	var select = document.getElementById("fileselect");
	var length = select.options.length;
	for (var i = length-1; 0 < i; i--) {
		select.options[i] = null;
	}
	document.getElementById("textarea").focus();
}
function saveSelectOption(){
	var selelem = document.getElementById("fileselect");
	var seloptary = [];
	var options = selelem.options;
	for(var l = options.length-1; 0 < l; l--){
		var sobj = options[l];
		var oobj = {};
		if(sobj.value&&sobj.text){
			oobj.txt = sobj.value;
			oobj.name = sobj.text;
			seloptary.push(oobj);
		}
	}
	chrome.storage.local.set({"text_object": JSON.stringify(seloptary)});
}
function createSelectOption(optt,optv,prntnd){
    var optelem = document.createElement("option");
    optelem.text = optt;
    optelem.value = optv;
    prntnd.add(optelem);
}
function clickDeleteButton(){
	var selelem = document.getElementById("fileselect");
	var idx = selelem.selectedIndex;
	if(idx != 0){
		selelem[idx] = null;
		clickResetButton();
		saveSelectOption();
	}
	document.getElementById("textarea").focus();
}
function clickResetButton(){
	document.getElementById("nameinput").value = "";
	document.getElementById("textarea").value = "";
	document.getElementById("fileselect").selectedIndex = 0;
	chrome.storage.local.remove("text_memo");
	document.getElementById("textarea").focus();
}
function clickCloseButton(){
	window.close();
}
function checkCurrentFocus(){
	chrome.windows.getCurrent(function(wind){
		if(!wind.focused){
			 chrome.windows.remove(wind.id);
		}
	});
}
chrome.windows.onFocusChanged.addListener(function(windid){
	document.getElementById("textarea").focus();
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.wind == "stat"){
		var sel = request.sel;
		if(sel){
			var txtarea = document.getElementById("textarea");
			if(txtarea.value){
				txtarea.value = txtarea.value+"\n\n"+sel;
			}else{
				txtarea.value = sel;
			}
		}
		chrome.windows.getCurrent(function(wind){
			 chrome.windows.update(wind.id,{focused:true});
		});
	}
});
