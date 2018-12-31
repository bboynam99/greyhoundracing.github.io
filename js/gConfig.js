(function(){
var gConfig = {};
window.gConfig = gConfig;
//
//gConfig.imgPath = "img/";
//gConfig.sePath = "sounds/";
//gConfig.sePath = "/android_asset/www/sounds/";
//********************
//************************************************************************************
gConfig.namespace  = "GreyhoundRacing"; 
gConfig.userInfo = {forSound:true, MY_ODDS: {COIN_TYPE: 0, ODDS:[0,0,0]}};//, FREE_COIN: 500
//
gConfig.onDeviceReady = function(){
	var getUserInfo = window.localStorage.getItem(gConfig.namespace+"/userInfo");
	if(getUserInfo == null){
		window.localStorage.setItem(gConfig.namespace+"/userInfo", JSON.stringify(gConfig.userInfo));
	} else{
		gConfig.userInfo = JSON.parse(getUserInfo);
	}
	s_bAudioActive = gConfig.userInfo.forSound;
	MY_ODDS = gConfig.userInfo.MY_ODDS;
	//if(!gConfig.userInfo.FREE_COIN){gConfig.userInfo.FREE_COIN = FREE_COIN; gConfig.updateUserInfo()};
	//MY_BALANCES[0].available = gConfig.userInfo.FREE_COIN;
	//server data
	if(window.userBalances && userBalances.DOGE)MY_BALANCES[1].available = Number(userBalances.DOGE);
	if(window.userBalances && userBalances.LTC)MY_BALANCES[2].available = Number(userBalances.LTC);
	//window.localStorage.clear();
};

/*window.onload = function(){
	onDeviceReady();
};*/

gConfig.updateUserInfo = function(){
	window.localStorage.setItem(gConfig.namespace+"/userInfo", JSON.stringify(gConfig.userInfo));
};

//******************************************************************************************************
//******************************************************************************************************
//******************************************************************************************************
/*document.addEventListener("backbutton", gameShutdow,false);
document.addEventListener("pause",gamePause,false);
document.addEventListener("resume",gameResume,false);
//
function gamePause(){
	//game.pause();
};
function gameResume(){
	//game.resume();
};
//
function gameConfirm(a){
	if(a!=1)return;
	MyPlugins.exitApp();
	//navigator.app.exitApp();
};
//
function gameShutdow(){
	//if(!for_backbutton)return;
	gConfig.showInterstitialAd();
	navigator.notification.confirm("Are you sure to quit?",gameConfirm,"Dots Battle",["Yes","No"]);
};*/

}());