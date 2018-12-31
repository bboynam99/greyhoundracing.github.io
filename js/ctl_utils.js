var s_iScaleFactor = 1;
var s_iOffsetX = 0;
var s_iOffsetY = 0;
//var s_oCanvasLeft;
//var s_oCanvasTop;
var s_bIsIphone = false;
var s_bIsRetina = false;
var s_oOrientationOk = true;

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
(function(a){(jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))})(navigator.userAgent || navigator.vendor || window.opera);
//
function trace(szMsg){
    console.log(szMsg);
}
//
$(window).resize(function() {
    sizeHandler();
});
//
function isRetina(){
    var query = "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)";
	s_bIsRetina = window.matchMedia(query).matches ? true : false;
};
//
function isIOS() {
    isRetina();
    var iDevices = ['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod']; 
    while(iDevices.length) {
        if(navigator.platform === iDevices.pop()){
            s_bIsIphone = true;
            return true; 
        } 
    } 
    s_bIsIphone = false;
    return false; 
}
//
function getSize(Name) {
    var size;
    var name = Name.toLowerCase();
    var document = window.document;
    var documentElement = document.documentElement;
    if (window["inner" + Name] === undefined) {// IE6 & IE7 don't have window.innerWidth or innerHeight
        size = documentElement["client" + Name];
    } else if(window["inner" + Name] != documentElement["client" + Name]){
        // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy
        // Insert markup to test if a media query will match document.doumentElement["client" + Name]
        var bodyElement = document.createElement("body");
        bodyElement.id = "vpw-test-b";
        bodyElement.style.cssText = "overflow:scroll";
        var divElement = document.createElement("div");
        divElement.id = "vpw-test-d";
        divElement.style.cssText = "position:absolute;top:-1000px";
        // Getting specific on the CSS selector so it won't get overridden easily
        divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
        bodyElement.appendChild(divElement);
        documentElement.insertBefore(bodyElement, document.head);
        if(divElement["offset" + Name] == 7) {
            // Media query matches document.documentElement["client" + Name]
            size = documentElement["client" + Name];
        } else {// Media query didn't match, use window["inner" + Name]
            size = window["inner" + Name];
        }
        // Cleanup
        documentElement.removeChild(bodyElement);
    } else{
        size = window["inner" + Name];
    }
    return size;
};
//
function getIOSWindowHeight() {
	return window.innerHeight * document.documentElement.clientWidth / window.innerWidth;
};
// You can also get height of the toolbars that are currently displayed
function getHeightOfIOSToolbars() {
	var tH = (window.orientation === 0 ? screen.height : screen.width) - getIOSWindowHeight();
	return tH > 1 ? tH : 0;
};	
//
function sizeHandler1() {
    window.scrollTo(0, 1);
    if (!$("#canvas"))return;
	
	var rw = CANVAS_WIDTH;
	var rh = CANVAS_HEIGHT;
	var w = window.innerWidth;
	var h = window.innerHeight;
	multiplier = Math.min((h / rh), (w / rw));
	var destW = rw * multiplier;
	var destH = rh * multiplier;
	$("#canvas").css("width",destW+"px");
	$("#canvas").css("height",destH+"px");
	$("#canvas").css("left",((w / 2) - (destW / 2))+"px");
}
//
function sizeHandler() {
    window.scrollTo(0, 1);
    if (!$("#canvas"))return;
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
    var h = iOS ? getIOSWindowHeight() : getSize("Height");
    var w = getSize("Width");
    _checkOrientation(w,h);
    var multiplier = Math.min((h / CANVAS_HEIGHT), (w / CANVAS_WIDTH));
    var destW = CANVAS_WIDTH * multiplier;
    var destH = CANVAS_HEIGHT * multiplier;
    var iAdd = 0;
    if (destH < h){
        iAdd = h - destH;
        destH += iAdd;
        destW += iAdd * (CANVAS_WIDTH / CANVAS_HEIGHT);
    } else  if(destW < w){
        iAdd = w - destW;
        destW += iAdd;
        destH += iAdd * (CANVAS_HEIGHT / CANVAS_WIDTH);
    }
    var fOffsetY = ((h / 2) - (destH / 2));
    var fOffsetX = ((w / 2) - (destW / 2));
    var fGameInverseScaling = (CANVAS_WIDTH / destW);
    if(fOffsetX * fGameInverseScaling < - EDGEBOARD_X || fOffsetY * fGameInverseScaling < - EDGEBOARD_Y){
        multiplier = Math.min(h / (CANVAS_HEIGHT - (EDGEBOARD_Y * 2)), w / (CANVAS_WIDTH - (EDGEBOARD_X * 2)));
        destW = CANVAS_WIDTH * multiplier;
        destH = CANVAS_HEIGHT * multiplier;
        fOffsetY = (h - destH) / 2;
        fOffsetX = (w - destW) / 2;
        fGameInverseScaling = (CANVAS_WIDTH / destW);
    }
    s_iOffsetX = ( - 1 * fOffsetX * fGameInverseScaling);
    s_iOffsetY = ( - 1 * fOffsetY * fGameInverseScaling);
    if (fOffsetY >= 0)s_iOffsetY = 0;
    if (fOffsetX >= 0)s_iOffsetX = 0;
	//
    window.s_oMenu && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    window.s_oGame && s_oGame.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    window.s_oBetPanel && s_oBetPanel.refreshButtonPos(s_iOffsetX, s_iOffsetY);
	//
    if(s_bIsRetina){//Ios Retina
        canvas = document.getElementById('canvas');
        s_oStage.canvas.width = destW*2;
        s_oStage.canvas.height = destH*2;
        canvas.style.width = destW+"px";
        canvas.style.height = destH+"px";
        var iScale = Math.min(destW / CANVAS_WIDTH, destH / CANVAS_HEIGHT);
		s_iScaleFactor = iScale*2;
        s_oStage.scaleX = s_oStage.scaleY = iScale*2;  
    } else if(s_bMobile){//Mobile
        $("#canvas").css("width",destW+"px");
        $("#canvas").css("height",destH+"px");
    } else{//Tablet, Pc
        s_oStage.canvas.width = destW;
        s_oStage.canvas.height = destH;
        s_iScaleFactor = Math.min(destW / CANVAS_WIDTH, destH / CANVAS_HEIGHT);
        s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor; 
    }
	//if(fOffsetY > 0)fOffsetY *= 2;
    $("#canvas").css("top", fOffsetY + "px");
    $("#canvas").css("left", fOffsetX + "px");
    fullscreenHandler();
};
//             
function _checkOrientation(iWidth,iHeight){
    if(s_bMobile && ENABLE_CHECK_ORIENTATION){
        if( iWidth>iHeight ){ 
            if( $(".orientation-msg-container").attr("data-orientation") === "landscape" ){
                $(".orientation-msg-container").css("display","none");
				s_oOrientationOk = true;
                s_oMain.startUpdate();
            } else{
                $(".orientation-msg-container").css("display","block");
				s_oOrientationOk = false;
                s_oMain.stopUpdate();
            }  
        } else{
            if( $(".orientation-msg-container").attr("data-orientation") === "portrait" ){
                $(".orientation-msg-container").css("display","none");
				s_oOrientationOk = true;
                s_oMain.startUpdate();
            } else{
                $(".orientation-msg-container").css("display","block");
				s_oOrientationOk = false;
                s_oMain.stopUpdate();
            }   
        }
    }
}
//
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
//@
function createBitmap(oSprite, widthHit, heightHit){
	var oBmp = new createjs.Bitmap(oSprite);
	if (widthHit && heightHit){
		var hitObject = new createjs.Shape();
		hitObject .graphics.beginFill("#fff").drawRect(0, 0, widthHit, heightHit);
		oBmp.hitArea = hitObject;
	}
	return oBmp;
}
//@
function createSprite(oSpriteSheet, oFrame, xHit, yHit, widthHit, heightHit){
	var oRetSprite = oFrame !== null ? new createjs.Sprite(oSpriteSheet, oFrame) : new createjs.Sprite(oSpriteSheet);
	if(xHit !== undefined && yHit !== undefined && widthHit !== undefined && heightHit !== undefined){
		var hitObject = new createjs.Shape();
		hitObject.graphics.beginFill("#000000").drawRect(xHit, yHit, widthHit, heightHit);
		oRetSprite.hitArea = hitObject;
	}
	return oRetSprite;
}
//Fisher-Yates Shuffle
function shuffle(array) {
    var counter = array.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
//  
Array.prototype.sortOn = function(){ 
	var dup = this.slice();
	if(!arguments.length) return dup.sort();
	var args = Array.prototype.slice.call(arguments);
	return dup.sort(function(a,b){
		var props = args.slice();
		var prop = props.shift();
		while(a[prop] == b[prop] && props.length) prop = props.shift();
		return a[prop] == b[prop] ? 0 : a[prop] > b[prop] ? 1 : -1;
	});
}
//
function getParamValue(paramName){
    var url = window.location.search.substring(1);
    var qArray = url.split('&');
    for (var i = 0; i < qArray.length; i++){
        var pArr = qArray[i].split('=');
        if (pArr[0] == paramName)return pArr[1];
    }
}
//  
function ctlArcadeResume(){
    null !== s_oMain && s_oMain.startUpdate()
}
//
function ctlArcadePause(){
    null !== s_oMain && s_oMain.stopUpdate()
}
//
function playSound(id,iVolume,iLoop){
	if(s_aSounds && s_aSounds[id]){
		s_aSounds[id].play();
		s_aSounds[id].volume(iVolume);
		s_aSounds[id].loop(iLoop);
		return s_aSounds[id];
	}
	return null;
}
//
function soundIsPlaying(id) {
     return (s_aSounds && s_aSounds[id] && s_aSounds[id].playing()) || false;
}
//
function pauseSound(id) {
     if(s_aSounds && s_aSounds[id])s_aSounds[id].pause();
}
//
function stopSound(id){
	if(s_aSounds && s_aSounds[id])s_aSounds[id].stop();
}
//
function setVolume(id, iVolume){
	if(s_aSounds && s_aSounds[id])s_aSounds[id].volume(iVolume);
}  
//
function setMute(id, bMute){
	if(s_aSounds && s_aSounds[id])s_aSounds[id].mute(bMute);
}
//        
window.addEventListener("orientationchange", onOrientationChange);
function onOrientationChange(){
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler();
}
//visibilitychange
(function() {
     var hidden = "hidden";
    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
	function onchange (evt) {
		var v = 'visible', h = 'hidden',
		evtMap = {focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h};
		evt = evt || window.event;
		if (evt.type in evtMap){
			document.body.className = evtMap[evt.type];
		} else{
			document.body.className = this[hidden] ? "hidden" : "visible";
			if (document.body.className === "hidden"){
				s_oOrientationOk && s_oMain.stopUpdate();
			} else{
				s_oOrientationOk && s_oMain.startUpdate();
			}
		}
    }
})();
//fullscreenchange
(function(){var d="undefined"!==typeof window&&"undefined"!==typeof window.document?window.document:{},g="undefined"!==typeof module&&module.exports,k="undefined"!==typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,b=function(){for(var a,e=["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "),"webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "),
"webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "),"mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "),"msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")],c=0,b=e.length,f={};c<b;c++)if((a=e[c])&&a[1]in d){for(c=0;c<a.length;c++)f[e[0][c]]=
a[c];return f}return!1}(),h={change:b.fullscreenchange,error:b.fullscreenerror},f={request:function(a){var e=b.requestFullscreen;a=a||d.documentElement;if(/5\.1[.\d]* Safari/.test(navigator.userAgent))a[e]();else a[e](k&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){d[b.exitFullscreen]()},toggle:function(a){this.isFullscreen?this.exit():this.request(a)},onchange:function(a){this.on("change",a)},onerror:function(a){this.on("error",a)},on:function(a,b){var c=h[a];c&&d.addEventListener(c,b,!1)},off:function(a,
b){var c=h[a];c&&d.removeEventListener(c,b,!1)},raw:b};b?(Object.defineProperties(f,{isFullscreen:{get:function(){return!!d[b.fullscreenElement]}},element:{enumerable:!0,get:function(){return d[b.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return!!d[b.fullscreenEnabled]}}}),g?module.exports=f:window.screenfull=f):g?module.exports=!1:window.screenfull=!1})();
//
function fullscreenHandler(){//trình duyệt tự ẩn tool bar
    if(ENABLE_FULLSCREEN && !inIframe()){
		var bFull = screen.height < window.innerHeight + 3 && screen.height > window.innerHeight - 3 ? !0 : !1; 
		if(s_bFullscreen != bFull){window.s_oInterface && s_oInterface.resetFullscreenBut(2), window.s_oMenu && s_oMenu.resetFullscreenBut(2), window.s_oBetPanel && s_oBetPanel.resetFullscreenBut(2)}
	}
}
if(screenfull.enabled)screenfull.on("change", function(){
    s_bFullscreen = screenfull.isFullscreen;
    window.s_oInterface && s_oInterface.resetFullscreenBut(1);
    window.s_oMenu && s_oMenu.resetFullscreenBut(1);
	window.s_oBetPanel && s_oBetPanel.resetFullscreenBut(1);
});