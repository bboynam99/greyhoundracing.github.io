function CMsgBox(){
    var _oBg;
    var _oMsgText;
	var _oSzMsg;
    var _oGroup;
	var _oMousedown;
	var _oForExit;
	var _oTween, _oTick, _oTimeout;
    //
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oMsgText = new createjs.Text("","30px "+PRIMARY_FONT, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-40;
        _oMsgText.textAlign = "center";
        _oMsgText.lineWidth = 400;
        _oMsgText.lineHeight = 48;
        _oMsgText.textBaseline = "middle";
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        _oGroup.addChild(_oBg,_oMsgText);
        s_oStage.addChild(_oGroup);
    };
    //
    this.unload = function(){
		this._onExit(true);
    };
    //
    this._initListener = function(){
        _oMousedown = _oGroup.on("mousedown", this._onExit);
    };
    //
    this.show = function(szMsg, forClick, forTimeOut, forTick){
		if(_oGroup.visible)return;
        _oGroup.visible = true;
		_oSzMsg = szMsg;
        _oMsgText.text = _oSzMsg;
        _oGroup.alpha = 0;
		_oForExit = false;
		this._initListener();
		var oParent = this;
        _oTween = createjs.Tween.get(_oGroup).to({alpha:1 }, 200).call(function() {if(forClick)_oForExit = true;});
		if(forTick)_oTick = _oGroup.addEventListener("tick", this._update);
        if(forTimeOut)_oTimeout = setTimeout(function(){oParent._onExit();},3000);
		//setTimeout(function(){_oGroup.off("tick",_oTick);},100);
    };
	this.hide = function(){
		this._onExit(true);
	}
	//
    this._update = function(event){//console.log("_update")
		var tick = createjs.Ticker.getTicks();
		if(tick%10 == 0){
			 _oMsgText.text = _oSzMsg+"...".substring(0, (tick/10)%3+1);
		}
	}
    //
    this._onExit = function(force){//console.log(2)
        if(_oForExit || force === true){//console.log(3)
            _oGroup.off("mousedown", _oMousedown);
			_oMousedown = null;
			_oTween && createjs.Tween.removeTweens(_oTween);
			_oTween = null;
			_oTick && _oGroup.off("tick",_oTick);
			_oTick = null;
			_oTimeout && clearTimeout(_oTimeout);
			_oTimeout = null;
            _oGroup.visible = false;
        }
    };
    this._init();
    return this;
}