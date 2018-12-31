function CTrackBg(oParentContainer){
    var _bUpdate;
    var _iCurBgFrame;
    var _iCurBgFrame2;
    var _iPreBgFrame;
    var _iUpdateStep;
    var _iCurStep;
    var _aSpriteBg;
    var _oParentContainer;
    //
    this._init = function(){
        _iCurBgFrame = 0;
        _iCurBgFrame2 = 0;
		_iPreBgFrame = 0;
        _iUpdateStep = 2;
        _iCurStep = 0;
        _aSpriteBg = new Array();
        for(var i=0;i<NUM_TRACK_BG;i++){
            var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_track_"+i));
            if(i>0)oBg.visible = false;
            _oParentContainer.addChild(oBg);
            _aSpriteBg[i] = oBg;
        }
        _bUpdate = true;
    };
    //
    this.update = function(){
        if(!_bUpdate)return _iCurBgFrame;
        _iCurStep++;
        if(_iCurStep === _iUpdateStep){
            _iCurStep = 0;
            _iCurBgFrame++; if(_iCurBgFrame >= 404)return;
			if(_iCurBgFrame >= 3){
				_iCurBgFrame2++;
				if(_iCurBgFrame==394)_iCurBgFrame2=8;
				if(_iCurBgFrame2>=8 && _iCurBgFrame < 394){
					_aSpriteBg[_iPreBgFrame].x -= 70;
					if(_aSpriteBg[_iPreBgFrame].x == -(3684-1024)){
						_aSpriteBg[_iPreBgFrame].x = -(11*70);
					}
				} else{//alert(_iCurBgFrame2+" - "+_iCurBgFrame)
					_aSpriteBg[_iCurBgFrame2].visible = true;
					_aSpriteBg[_iPreBgFrame].visible = false;
					_iPreBgFrame = _iCurBgFrame2;
				}
			}
            if(_iCurBgFrame === 416-13){//_iCurBgFrame === _aSpriteBg.length-1
                _bUpdate = false;
                s_oGame.checkGreyhoundArrival();
            } else if(_iCurBgFrame === 5){//17->2
                s_oGame.startGreyhounds();
            }
        }
        return _iCurBgFrame;
    };
    _oParentContainer = oParentContainer;
    this._init();
}