function CBetPanel(){
    var _iCurPage;
    var _iTotBet;
    var _iChipSelected;
    var _aHistory;
	//btn
    var _oButExit;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _oAudioToggle;
    var _pStartPosFullscreen;
    var _oButFullscreen;
	//displayobject
    var _oContainerPages;
    var _aPages;
    var _oMaskPanel;
    var _oChipPanel;
	var _oTextHelpPage;
    var _oArrowLeft;
    var _oArrowRight;
    var _oMsgBox;
    //
    this._init = function(){
        _iCurPage = 0;
        _iTotBet = 0;
        _iChipSelected = 0;
        _aHistory = new Array();
        s_oBetList.reset();
		//
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_bet_panel"));
        s_oStage.addChild(oBg);
		//
        var oSpriteExit = s_oSpriteLibrary.getSprite("but_home");
        _pStartPosExit = {x:CANVAS_WIDTH - oSpriteExit.width/2-10,y:oSpriteExit.height/2+10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSpriteExit,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP,this.onExit,this);
		//
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - oSpriteExit.width -10, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
		//
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        if(ENABLE_FULLSCREEN === false)_fRequestFullScreen = false;
        if (_fRequestFullScreen && inIframe() === false){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height / 2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
		//
        var oSpriteBg = s_oSpriteLibrary.getSprite("simple_bet_panel");
        BET_PANEL_WIDTH = oSpriteBg.width;
        BET_PANEL_HEIGHT = oSpriteBg.height;
        _oContainerPages = new createjs.Container();
        _oContainerPages.x = BET_PANEL_X;
        _oContainerPages.y = BET_PANEL_Y;
        s_oStage.addChild(_oContainerPages);
        //
        _oMaskPanel = new createjs.Shape();
        _oMaskPanel.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(BET_PANEL_X+6, 0,BET_PANEL_WIDTH-12 , BET_PANEL_HEIGHT);
		_oMaskPanel.y = BET_PANEL_Y;
        s_oStage.addChild(_oMaskPanel);
        _oContainerPages.mask = _oMaskPanel;
        //
        _aPages = new Array();
        _aPages[0] = new CSimpleBetPanel(0,0,_oContainerPages);
        _aPages[1] = new CForecastPanel(BET_PANEL_WIDTH,0,_oContainerPages);
		//
        _oChipPanel = new CChipPanel(773,230,s_oStage);
        //
        _oTextHelpPage = new createjs.Text(eval("TEXT_HELP_PAGE_"+_iCurPage), "24px " + PRIMARY_FONT, "#fff");
        _oTextHelpPage.textAlign = "right";
        _oTextHelpPage.textBaseline = "alphabetic";
        _oTextHelpPage.x = BET_PANEL_X+BET_PANEL_WIDTH-10;
        _oTextHelpPage.y = 188
        s_oStage.addChild(_oTextHelpPage);
		//
        _oArrowLeft = new CGfxButton(BET_PANEL_X + 7,CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("arrow_left"),s_oStage);
        _oArrowLeft.addEventListener(ON_MOUSE_UP,this._onArrowLeft,this);
        _oArrowRight = new CGfxButton(BET_PANEL_X + oSpriteBg.width -7,CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("arrow_right"),s_oStage);
        _oArrowRight.addEventListener(ON_MOUSE_UP,this._onArrowRight,this);
		//
        _oMsgBox = new CMsgBox();
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    //
    this.unload = function(){
        createjs.Tween.removeAllTweens();
        _oButFullscreen && _oButFullscreen.unload();
        _oAudioToggle && _oAudioToggle .unload();
        _oButExit.unload();
        _oArrowLeft.unload();
        _oArrowRight.unload();
        _oMsgBox.unload();
        _oChipPanel.unload();
        for(var i=0;i<_aPages.length;i++)_aPages[i].unload();
       s_oStage.removeAllChildren(); 
	   s_oBetPanel = null;
    };
    //
    this.refreshButtonPos = function (iNewX, iNewY) {
        _oAudioToggle && _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        _oButFullscreen && _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        _oButExit.setPosition(_pStartPosExit.x - iNewX,_pStartPosExit.y + iNewY);
		BET_PANEL_Y = (CANVAS_HEIGHT - BET_PANEL_HEIGHT - 70)/2+70;
		_oContainerPages.y = BET_PANEL_Y;
		_oMaskPanel.y = BET_PANEL_Y;
		_oArrowLeft.setY((CANVAS_HEIGHT - 70)/2+70);
		_oArrowRight.setY((CANVAS_HEIGHT - 70)/2+70);
    };
    //
    this.setChipSelected = function(iIndex){
        _iChipSelected = iIndex;
    };
    this.getChipSelected = function(){
        return _iChipSelected;
    };
    //
    this.setSimpleBet = function(iIndex,iPlace,iFicheValue,oBut){
		var chipRate = GAME_ODDS_RATE[MY_ODDS.COIN_TYPE];
        if((_iTotBet+iFicheValue) > MAX_BET)return _oMsgBox.show(TEXT_ERR_MAX_BET+"\n"+TEXT_MAX_BET + ": " + MAX_BET + " CHIP", true, true);
        if((_iTotBet+iFicheValue)*chipRate > s_iCurMoney )return _oMsgBox.show(TEXT_NO_MONEY, true, true);
        s_oBetList.addSimpleBet(iIndex,iPlace,iFicheValue);
        _iTotBet += iFicheValue;
        var totBetCoin = _iTotBet*chipRate;
        _oChipPanel.refreshBet(totBetCoin);
        _aHistory.push(oBut);
        return true;
    };
    //
    this.setForecastBet = function(iFirst,iSecond,iFicheValue,oBut){
		var chipRate = GAME_ODDS_RATE[MY_ODDS.COIN_TYPE];
        if((_iTotBet+iFicheValue) > MAX_BET)return _oMsgBox.show(TEXT_ERR_MAX_BET+"\n"+TEXT_MAX_BET + ": " + MAX_BET + " CHIP", true, true);
        if((_iTotBet+iFicheValue)*chipRate > s_iCurMoney )return _oMsgBox.show(TEXT_NO_MONEY, true, true);
        s_oBetList.addForecastBet(iFirst,iSecond,iFicheValue);
        _iTotBet += iFicheValue;
        var totBetCoin = _iTotBet*chipRate;
        _oChipPanel.refreshBet(totBetCoin);
        _aHistory.push(oBut);
        return true;
    };
    //
    this.refreshPagePos = function(iNextPage,iX){
        _oContainerPages.x = BET_PANEL_X;
        _aPages[_iCurPage].setX(0);
        _aPages[iNextPage].setX(iX);
    };
    //
    this.clearBet = function(){
        for(var i=0;i<_aHistory.length;i++)_aHistory[i].clearBet();
        _iTotBet = 0;
        _aPages[0].clearBet();
        s_oBetList.reset();
        _oChipPanel.refreshBet(0);
    };
    //
    this._onArrowLeft = function(){
        var iPrevPage = _iCurPage;
        _iCurPage++;
        if(_iCurPage === _aPages.length){
            _iCurPage = 0;
            iPrevPage = _aPages.length-1;
        }
		_oTextHelpPage.text = eval("TEXT_HELP_PAGE_"+_iCurPage);
        _aPages[_iCurPage].setX(BET_PANEL_WIDTH);       
        createjs.Tween.get(_oContainerPages).to({x: -BET_PANEL_WIDTH + BET_PANEL_X}, 500,createjs.Ease.cubicOut).call(function () {s_oBetPanel.refreshPagePos(iPrevPage,BET_PANEL_WIDTH);});
    };
    //
    this._onArrowRight = function(){
        var iPrevPage = _iCurPage;
        _iCurPage--;
        if(_iCurPage < 0)_iCurPage = _aPages.length-1;
		_oTextHelpPage.text = eval("TEXT_HELP_PAGE_"+_iCurPage);
        _aPages[_iCurPage].setX(-BET_PANEL_WIDTH);
        createjs.Tween.get(_oContainerPages).to({x: BET_PANEL_X+ BET_PANEL_WIDTH}, 500,createjs.Ease.cubicOut).call(function () {s_oBetPanel.refreshPagePos(iPrevPage,-BET_PANEL_WIDTH);});
    };
    //
    this.onStartRace = function(){
        if(_iTotBet < MIN_BET){
            _oMsgBox.show(TEXT_ERR_MIN_BET, true, true);//szMsg, forClick, forTimeOut, forTick
        } else{
            _oMsgBox.show(TEXT_IS_PREPARING, true, false, true);
			var chipRate = GAME_ODDS_RATE[MY_ODDS.COIN_TYPE];
			s_iCurMoney = Number(MY_BALANCES[MY_ODDS.COIN_TYPE].available);
			s_iCurMoney = Number(numberFormat(s_iCurMoney - _iTotBet*chipRate, {decimals: 8, clear_decimals: true, sep:""}));
			MY_BALANCES[MY_ODDS.COIN_TYPE].available = s_iCurMoney;
			_oChipPanel.refreshMoney();
			if(MY_ODDS.COIN_TYPE == 0){//FCOIN
				setTimeout(function(){s_oBetPanel.serverResultBetRequest()},1000);
			} else{
				setTimeout(function(){
					var rank = shuffle([0,1,2,3,4,5]);//alert(rank)
					s_oBetPanel.serverResultBetRequest(rank);
				},2000);
			}
        }
    };
	//
    this.serverResultBetRequest = function(rank) {//alert(data.finalSymbol)
        this.unload();
		s_oMain.gotoGame(_iTotBet, rank);
	}
    //
    this.onExit = function(){alert("home")
        //this.unload();
        //s_oMain.gotoMenu();
    };
	//
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
		gConfig.userInfo.forSound = s_bAudioActive;
		gConfig.updateUserInfo();
    };
	//@
    this.resetFullscreenBut = function(y) {
        _oButFullscreen && _oButFullscreen.setActive(s_bFullscreen)
    };
	//@
    this._onFullscreenRelease = function(){
        s_bFullscreen ? _fCancelFullScreen.call(window.document) :  _fRequestFullScreen.call(window.document.documentElement);
        sizeHandler();
    };
	//
    s_oBetPanel = this;
    this._init();
}
var s_oBetPanel = null;