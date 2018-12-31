function CMain(oData) {
    var RESOURCE_TO_LOAD = 0;
    var _iCurResource = 0;
    var _bUpdate;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oGame;
	//@
    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
		s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false) {
            s_oStage.enableMouseOver(10);
            $('body').on('contextmenu', '#canvas', function(e){return false;});
        }
        s_iPrevTime = new Date().getTime();
        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);
        if(navigator.userAgent.match(/Windows Phone/i))DISABLE_SOUND_MOBILE = true;
        s_oSpriteLibrary = new CSpriteLibrary();
        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
	//@
    this.preloaderReady = function () {
        //jQuery.getJSON("greyhound_info.json", this.onLoadedJSON); 
		var data = {"greyhound_names":["thám tử","sâu xám","củ riềng","t-rex","mực","học sinh"],//"greyhound_names":["psycho","all saturdays","the norman","t-rex","nice tuft","baloo"]
			"odd_win_bet":[3.7,4.8,2.2,10.5,17.2,8.75],
			"odd_place_bet":[1.95,2.55,1.25,5.5,7.75,3.05],
			"odd_show_bet":[1.25,1.7,1.09,2.55,3.9,1.75],
			"forecast":[{"first":1,"second":2,"odd":20},{"first":1,"second":3,"odd":8},{"first":1,"second":4,"odd":30},{"first":1,"second":5,"odd":40},{"first":1,"second":6,"odd":23},
						{"first":2,"second":1,"odd":24},{"first":2,"second":3,"odd":10},{"first":2,"second":4,"odd":25},{"first":2,"second":5,"odd":28},{"first":2,"second":6,"odd":38},
						{"first":3,"second":1,"odd":6},{"first":3,"second":2,"odd":9},{"first":3,"second":4,"odd":26},{"first":3,"second":5,"odd":31},{"first":3,"second":6,"odd":9},
						{"first":4,"second":1,"odd":84},{"first":4,"second":2,"odd":56},{"first":4,"second":3,"odd":23},{"first":4,"second":5,"odd":80},{"first":4,"second":6,"odd":65},
						{"first":5,"second":1,"odd":70},{"first":5,"second":2,"odd":70},{"first":5,"second":3,"odd":68},{"first":5,"second":4,"odd":84},{"first":5,"second":6,"odd":80},
						{"first":6,"second":1,"odd":38},{"first":6,"second":2,"odd":48},{"first":6,"second":3,"odd":13},{"first":6,"second":4,"odd":50},{"first":6,"second":5,"odd":60}]
		};
		this.onLoadedJSON(data);
        _bUpdate = true;
    };
    //@
    this.onLoadedJSON = function (oData) {
        s_oGameSettings = new CGameSettings(oData);
        s_oBetList = new CBetList();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            s_oMain._initSounds();
        }
        s_oMain._loadImages();
    };
    //@
    this.soundLoaded = function () {
        _iCurResource++;
        _oPreloader.refreshLoader(Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100));
        _iCurResource === RESOURCE_TO_LOAD && s_oMain._onRemovePreloader();
    };
	//@
    this._initSounds = function () {
		var soundArr = [];
        soundArr.push({path: SOURCE_PATH+"sounds/", filename: "chip", loop: !1, volume: 1, ingamename: "chip"});
        soundArr.push({path: SOURCE_PATH+"sounds/", filename: "click", loop: !1, volume: 1, ingamename: "click"});
        soundArr.push({path: SOURCE_PATH+"sounds/", filename: "start_race", loop: !1, volume: 1, ingamename: "start_race"});
        soundArr.push({path: SOURCE_PATH+"sounds/", filename: "photo", loop: !1, volume: 1, ingamename: "photo"});
        soundArr.push({path: SOURCE_PATH+"sounds/", filename: "soundtrack", loop: !0, volume: 1, ingamename: "soundtrack"});
        RESOURCE_TO_LOAD += soundArr.length;
        s_aSounds = [];
        for(var i = 0; i < soundArr.length; i++){
			s_aSounds[soundArr[i].ingamename] = new Howl({
				src: [soundArr[i].path + soundArr[i].filename + ".mp3", soundArr[i].path + soundArr[i].filename + ".ogg"],
				autoplay: !1,
				preload: !0,
				loop: soundArr[i].loop,
				volume: soundArr[i].volume,
				onload: s_oMain.soundLoaded
			});
		}
    };
	//@
    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        //s_oSpriteLibrary.addSprite("bg_menu", SOURCE_PATH+"sprites/bg_menu.jpg");
        //s_oSpriteLibrary.addSprite("logo_menu", SOURCE_PATH+"sprites/logo_menu.png");
        //s_oSpriteLibrary.addSprite("but_credits", SOURCE_PATH+"sprites/but_credits.png");
        //s_oSpriteLibrary.addSprite("logo_ctl", SOURCE_PATH+"sprites/logo_ctl.png");
        //s_oSpriteLibrary.addSprite("lose_panel", SOURCE_PATH+"sprites/lose_panel.png");
		
        s_oSpriteLibrary.addSprite("but_exit", SOURCE_PATH+"sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", SOURCE_PATH+"sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_play", SOURCE_PATH+"sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart", SOURCE_PATH+"sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home", SOURCE_PATH+"sprites/but_home.png");
        s_oSpriteLibrary.addSprite("msg_box", SOURCE_PATH+"sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", SOURCE_PATH+"sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_no", SOURCE_PATH+"sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes", SOURCE_PATH+"sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("arrow_left", SOURCE_PATH+"sprites/arrow_left.png");
        s_oSpriteLibrary.addSprite("arrow_right", SOURCE_PATH+"sprites/arrow_right.png");
        s_oSpriteLibrary.addSprite("fiche_0", SOURCE_PATH+"sprites/fiche_0.png");
        s_oSpriteLibrary.addSprite("fiche_1", SOURCE_PATH+"sprites/fiche_1.png");
        s_oSpriteLibrary.addSprite("fiche_2", SOURCE_PATH+"sprites/fiche_2.png");
        s_oSpriteLibrary.addSprite("fiche_3", SOURCE_PATH+"sprites/fiche_3.png");
        s_oSpriteLibrary.addSprite("fiche_4", SOURCE_PATH+"sprites/fiche_4.png");
        s_oSpriteLibrary.addSprite("fiche_5", SOURCE_PATH+"sprites/fiche_5.png");
        s_oSpriteLibrary.addSprite("bg_bet_panel", SOURCE_PATH+"sprites/bg_bet_panel.jpg");
        s_oSpriteLibrary.addSprite("money_panel", SOURCE_PATH+"sprites/money_panel.png");
        s_oSpriteLibrary.addSprite("simple_bet_panel", SOURCE_PATH+"sprites/simple_bet_panel.png");
        s_oSpriteLibrary.addSprite("forecast_panel", SOURCE_PATH+"sprites/forecast_panel.png");
        s_oSpriteLibrary.addSprite("bet_place", SOURCE_PATH+"sprites/bet_place.png");
        s_oSpriteLibrary.addSprite("fiche_highlight", SOURCE_PATH+"sprites/fiche_highlight.png");
        s_oSpriteLibrary.addSprite("odd_bg", SOURCE_PATH+"sprites/odd_bg.png");
        s_oSpriteLibrary.addSprite("rank_panel", SOURCE_PATH+"sprites/rank_panel.png");
        s_oSpriteLibrary.addSprite("panel_arrival", SOURCE_PATH+"sprites/panel_arrival.png");
        s_oSpriteLibrary.addSprite("bibs", SOURCE_PATH+"sprites/bibs.png");
        s_oSpriteLibrary.addSprite("but_skip", SOURCE_PATH+"sprites/but_skip.png");
        s_oSpriteLibrary.addSprite("but_start_race", SOURCE_PATH+"sprites/but_start_race.png");
        s_oSpriteLibrary.addSprite("but_clear_bet", SOURCE_PATH+"sprites/but_clear_bet.png");
        s_oSpriteLibrary.addSprite("fiche_panel", SOURCE_PATH+"sprites/fiche_panel.png");
        s_oSpriteLibrary.addSprite("fill_bar", SOURCE_PATH+"sprites/fill_bar.png");
        s_oSpriteLibrary.addSprite("win_panel", SOURCE_PATH+"sprites/win_panel.png");
        s_oSpriteLibrary.addSprite("coin_select_but", SOURCE_PATH+"sprites/but_coin.png");
        s_oSpriteLibrary.addSprite("money_bg", SOURCE_PATH+"sprites/money_bg.png");
        //
        for(var i=0;i<NUM_GREYHOUNDS;i++){
            s_oSpriteLibrary.addSprite("bib_gui_"+i, SOURCE_PATH+"sprites/bib_gui_"+i+".png");
            s_oSpriteLibrary.addSprite("greyhound_"+(i+1), SOURCE_PATH+"sprites/greyhound_"+(i+1)+".png");
        }
        //
        for(var j=0;j<NUM_TRACK_BG;j++){
			s_oSpriteLibrary.addSprite("bg_track_"+j, SOURCE_PATH+"sprites/bg_track/bg_track_"+j+".jpg");
        }
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();//alert(s_oSpriteLibrary.getNumSprites())
        s_oSpriteLibrary.loadSprites();
    };
	//
    this._onImagesLoaded = function () {
        _iCurResource++;
        _oPreloader.refreshLoader(Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100));
        _iCurResource === RESOURCE_TO_LOAD && s_oMain._onRemovePreloader();
    };
	//
    this._onAllImagesLoaded = function (){};
	//
    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };
    //
    this._onRemovePreloader = function(){
        _oPreloader.unload();
        if(!isIOS()){
            s_oSoundTrack = playSound("soundtrack", 1, !0);
        }
        //this.gotoMenu();
		this.gotoBetPanel();
    };
    //
    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    //
    this.gotoBetPanel = function(){
        new CBetPanel();
        _iState = STATE_BET_PANEL;
        //$(s_oMain).trigger("start_session");
    };
    //
    this.gotoGame = function (_iTotBet, rankArr) {
        _oGame = new CGame(_iTotBet, rankArr);
        _iState = STATE_GAME;
    };
	//
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        DISABLE_SOUND_MOBILE === !0 && s_bMobile === !0 || Howler.mute(!0);
    };
	//
    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        (DISABLE_SOUND_MOBILE === !1 || s_bMobile === !1) && s_bAudioActive && Howler.mute(!1)
    };
	//
    this._update = function (event) {
        if (!_bUpdate)return;
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }
        if(_iState === STATE_GAME)_oGame.update();
        s_oStage.update(event);
    };
	//
    s_oMain = this;
    _oData = oData;
    s_iCurMoney = MY_BALANCES[MY_ODDS.COIN_TYPE].available;
    CHIP_VALUES = oData.chip_values;
    NUM_CHIPS = CHIP_VALUES.length;
    MIN_BET = oData.min_bet;
    MAX_BET = oData.max_bet;
    WIN_OCCURRENCE = oData.win_occurrence;
    SHOW_CREDITS = oData.show_credits;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    this.initContainer();
}
//
var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_bStorageAvailable = true;
var s_iCurMoney;
var s_aSounds;