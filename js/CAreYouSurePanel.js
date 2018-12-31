function CAreYouSurePanel(oParentContainer){
    var _oButYes;
    var _oButNo;
    var _oContainer;
    var _oParentContainer;
	var _onClickContainer;
    //
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _onClickContainer = _oContainer.on("click", function() {});
        _oParentContainer.addChild(_oContainer);
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oContainer.addChild(oBg);
        var oText = new createjs.Text(TEXT_ARE_YOU_SURE, "30px " + PRIMARY_FONT, "#fff");
        oText.textAlign = "center";
        oText.textBaseline = "alphabetic";
        oText.x = CANVAS_WIDTH/2;
        oText.y = 280;
        oText.lineWidth = 400;
        oText.lineHeight = 48;
        _oContainer.addChild(oText);
        _oButYes = new CGfxButton(CANVAS_WIDTH/2 + 170,460,s_oSpriteLibrary.getSprite("but_yes"),_oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP,this._onReleaseYes,this);
        _oButNo = new CGfxButton(CANVAS_WIDTH/2 - 170,460,s_oSpriteLibrary.getSprite("but_no"),_oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP,this._onReleaseNo,this);
    };
	//
    this.unload = function() {
        _oContainer.off("click", _onClickContainer);
        _oButYes.unload();
        _oButNo.unload();
    };
    this.show = function(){
        _oContainer.visible = true;
        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500,createjs.Ease.cubicOut);
    };
    this._onReleaseYes = function(){
        s_oGame.onExit();
    };
    this._onReleaseNo = function(){
        _oContainer.visible = false;
        s_oGame.unpause();
    };
    _oParentContainer = oParentContainer;
    this._init(oParentContainer);
}