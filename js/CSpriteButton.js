function CSpriteButton(iXPos, iYPos, oSprite, iFrame, iStage) {
    var _bDisable, _oFrame, _aCbCompleted, _aCbOwner, _oButton, _oStage, _oListenerMouseDown, _oListenerMouseUp;
    this._init = function(iXPos, iYPos, oSprite, iFrame, iStage) {
        _oStage = void 0 !== iStage ? iStage : s_oStage;
        _bDisable = false;
        _aCbCompleted = [];
        _aCbOwner = [];
        var oSpriteSheet = new createjs.SpriteSheet({
            images: [oSprite],
            frames: {
                width: oSprite.width,
                height: oSprite.height/3,
                regX: oSprite.width / 2,
                regY: oSprite.height / (2*3)
            },
            animations: {
                frame0: [0],
                frame1: [1],
                frame2: [2]
            }
        });
        _oFrame = "frame" + iFrame;
        _oButton = createSprite(oSpriteSheet, _oFrame);//alert(oSpriteSheet.getFrame(0).regY)
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.stop();
        s_bMobile || (_oButton.cursor = "pointer");
        _oStage.addChild(_oButton);
        this._initListener();
    };
    this.unload = function() {
        _oButton.off("mousedown", _oListenerMouseDown);
        _oButton.off("pressup", _oListenerMouseUp);
        _oStage.removeChild(_oButton);
    };
    this._initListener = function() {
        _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerMouseUp = _oButton.on("pressup", this.buttonRelease);
    };
    this.addEventListener = function(iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };
    this.setCursorType = function(bCursor) {
        _oButton.cursor = bCursor;
    };
    this.gotoAndStop = function(frame) {
		_oFrame = frame;
        _oButton.gotoAndStop(frame);
    };
    this.enable = function() {
        _bDisable = false;
    };
    this.disable = function() {
        _bDisable = true;
    };
	this.getCurrentFrame = function() {
		return _oButton.currentFrame;
	}
    this.buttonDown = function() {
		if(_bDisable)return;
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;
        _aCbCompleted[ON_MOUSE_DOWN] && _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN])
    };
    this.buttonRelease = function() {
		if(_bDisable)return;
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
        playSound("click", 1, !1);
        _aCbCompleted[ON_MOUSE_UP] && _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _oFrame)
    };
    this.setPosition = function(x, y) {
        _oButton.x = x;
        _oButton.y = y;
    };
    this._init(iXPos, iYPos, oSprite, iFrame, iStage);
}