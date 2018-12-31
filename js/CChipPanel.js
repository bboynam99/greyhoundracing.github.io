function CChipPanel(iX,iY,oParentContainer){//@
    var _aChipButtons;
    var _oChipHighlight;
	var _oHelpBtn;
    var _oClearBetBtn;
	var _oSelecCoinBtn;
    var _oStartRaceBtn;
	//
    var _oTextMoney;
	var _oTextHelpMoney;
    var _oTextMaxBet;
    var _oTextBet;
    var _oContainer;
    var _oParentContainer;
    //
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
		//
        _oHelpBtn = new CTextButton(100,0,s_oSpriteLibrary.getSprite("but_clear_bet"), TEXT_BUT_HELP, PRIMARY_FONT, "#fff", 22,_oContainer);
        _oHelpBtn.addEventListener(ON_MOUSE_UP,this._onShowHelp,this);
		//
        _oClearBetBtn = new CTextButton(100,42,s_oSpriteLibrary.getSprite("but_clear_bet"), TEXT_CLEAR_BET, PRIMARY_FONT, "#fff", 22,_oContainer);
        _oClearBetBtn.addEventListener(ON_MOUSE_UP,this._onClearBet,this);
		//
        var oSprite = s_oSpriteLibrary.getSprite("money_panel");
        var oMinMaxBet = createBitmap(s_oSpriteLibrary.getSprite("money_panel"));
        oMinMaxBet.regX = oSprite.width/2;
        oMinMaxBet.x = 100;
        oMinMaxBet.y = 62;
        _oContainer.addChild(oMinMaxBet);
        //
        _oTextMaxBet = new createjs.Text(TEXT_MAX_BET + ": " + MAX_BET + " Chip", "19px " + SECONDARY_FONT, "#ffde00");
        _oTextMaxBet.textAlign = "center";
        _oTextMaxBet.textBaseline = "alphabetic";
        _oTextMaxBet.x = 100;
        _oTextMaxBet.y = oMinMaxBet.y + 29;
        _oContainer.addChild(_oTextMaxBet);
        //
        var oMoneyBg = createBitmap(s_oSpriteLibrary.getSprite("money_panel"));
        oMoneyBg.regX = oSprite.width/2;
        oMoneyBg.x = 100;
        oMoneyBg.y = 132;
        _oContainer.addChild(oMoneyBg);
        //
        var oText = new createjs.Text(TEXT_BET, "18px " + TERTIARY_FONT, "#fff");
        oText.textAlign = "left";
        oText.textBaseline = "alphabetic";
        oText.x = 3;
        oText.y = oMoneyBg.y;
        _oContainer.addChild(oText);
        //
        _oTextBet = new createjs.Text("0 "+MY_BALANCES[MY_ODDS.COIN_TYPE].name, "26px " + SECONDARY_FONT, "#ffde00");
        _oTextBet.textAlign = "center";
        _oTextBet.textBaseline = "alphabetic";
        _oTextBet.x = 100;
        _oTextBet.y = oMoneyBg.y+32;
        _oContainer.addChild(_oTextBet);
       
        //
        _oTextHelpMoney = new createjs.Text("1 CHIP = 0.00003 DOGE", "26px " + SECONDARY_FONT, "#ffde00");
        _oTextHelpMoney.textAlign = "center";
        _oTextHelpMoney.textBaseline = "alphabetic";
        _oTextHelpMoney.x = 512;
        _oTextHelpMoney.y = 154;
        s_oStage.addChild(_oTextHelpMoney);
        //
		oSprite = s_oSpriteLibrary.getSprite("money_bg");
        var oMoneyBg = createBitmap(oSprite);
        oMoneyBg.x = 76;
        oMoneyBg.y = 122;
        s_oStage.addChild(oMoneyBg);
        //
        _oTextMoney = new createjs.Text("", "22px " + WEB_FONT, "#ffde00");
        _oTextMoney.textAlign = "center";
		_oTextMoney.lineHeight = 26;
        _oTextMoney.textBaseline = "alphabetic";
        _oTextMoney.x = 153;
        _oTextMoney.y = 150;
        s_oStage.addChild(_oTextMoney);
		//
		oSprite = s_oSpriteLibrary.getSprite("coin_select_but");
        _oSelecCoinBtn = new CSpriteButton(220 + oSprite.width / 2, oSprite.height / (2*3)+120, oSprite, 0);
        _oSelecCoinBtn.addEventListener(ON_MOUSE_UP, this._onSelectCoin, this);
        //
        _oStartRaceBtn = new CButStartRace(100,344,s_oSpriteLibrary.getSprite("but_start_race"), TEXT_START_RACE, "#fff", 24,_oContainer);
        _oStartRaceBtn.addEventListener(ON_MOUSE_UP,this._onStartRace,this);
        //
        this._initChips();
		this._setOddCoinType(MY_ODDS.COIN_TYPE);
    };
    //
    this.unload = function(){
         for(var i=0;i<_aChipButtons;i++)_aChipButtons[i].unload();
         _oClearBetBtn.unload();
         _oHelpBtn.unload();
         _oStartRaceBtn.unload();
		 _oSelecCoinBtn.unload();
    };
    //
    this._initChips = function(){
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("fiche_panel"));
        oBg.x = 0;
        oBg.y = 184;
        _oContainer.addChild(oBg);
        //SET FICHES BUTTON
        var aPos = [{x:46,y:35},{x:101,y:35},{x:153,y:35},{x:46,y:88},{x:101,y:88},{x:153,y:88}];
        _aChipButtons = new Array();
        for(var i=0;i<NUM_CHIPS;i++){
            var oSprite = s_oSpriteLibrary.getSprite('fiche_'+i);
            _aChipButtons[i] = new CGfxButton(aPos[i].x,aPos[i].y + oBg.y,oSprite,_oContainer);
            _aChipButtons[i].addEventListenerWithParams(ON_MOUSE_UP, this._onFicheClicked, this,i);
        }
        //SET SELECTED CHIP
        var oSpriteHighlight = s_oSpriteLibrary.getSprite('fiche_highlight');
        _oChipHighlight = createBitmap(oSpriteHighlight);
        _oChipHighlight.regX = oSpriteHighlight.width/2;
        _oChipHighlight.regY = oSpriteHighlight.height/2;
        _oContainer.addChild(_oChipHighlight);
    };
	//
    this._setChips = function(){
		var chipSelected = MY_ODDS.ODDS[MY_ODDS.COIN_TYPE];
        this._onFicheClicked(chipSelected);
	}
    this.refreshMoney = function(){
		var iMoney = MY_BALANCES[MY_ODDS.COIN_TYPE].available;
		iMoney = numberFormat(iMoney, {decimals: 8, clear_decimals: true, limit_length_decimals: 10});
        _oTextMoney.text = MY_BALANCES[MY_ODDS.COIN_TYPE].name + "\n" + iMoney;
    };
    this.refreshBet = function(iBet){
		if(iBet)iBet = numberFormat(iBet, {decimals: 8, clear_decimals: true, limit_length_decimals: 10});
        _oTextBet.text = iBet+" "+MY_BALANCES[MY_ODDS.COIN_TYPE].name;
    };
    this._onStartRace = function(){
        s_oBetPanel.onStartRace();
    };
    this._onClearBet = function(){
        s_oBetPanel.clearBet();
    };
    this._onFicheClicked = function(iIndex){
        _oChipHighlight.x = _aChipButtons[iIndex].getX()-1;
        _oChipHighlight.y = _aChipButtons[iIndex].getY()-1;
        s_oBetPanel.setChipSelected(iIndex);
		if(MY_ODDS.ODDS[MY_ODDS.COIN_TYPE] != iIndex){
			MY_ODDS.ODDS[MY_ODDS.COIN_TYPE] = iIndex;
			gConfig.userInfo.MY_ODDS = MY_ODDS;
			gConfig.updateUserInfo();
		}
    };
	this._onSelectCoin = function(){
		var frameNum = _oSelecCoinBtn.getCurrentFrame();
		frameNum ++; if(frameNum > 2)frameNum = 0;
		MY_ODDS.COIN_TYPE = frameNum;
		gConfig.userInfo.MY_ODDS = MY_ODDS;
		gConfig.updateUserInfo();
		//
        this._setOddCoinType(MY_ODDS.COIN_TYPE);
		this._onClearBet();
		//s_oGame.changeCoinBet();
	};
    this._setOddCoinType = function(id) {
        _oSelecCoinBtn.gotoAndStop("frame" + id);
		s_iCurMoney = Number(MY_BALANCES[MY_ODDS.COIN_TYPE].available);
		this.refreshMoney();
		_oTextHelpMoney.text = "1 CHIP = "+GAME_ODDS_RATE[id]+" "+MY_BALANCES[MY_ODDS.COIN_TYPE].name;
		this._setChips();
	}
	this._onShowHelp = function(id) {
		$("#game_guide").show();
	}
    //
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}