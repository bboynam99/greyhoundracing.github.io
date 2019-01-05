pragma solidity ^0.4.23;
import "./SafeMath.sol";
import "./Ownable.sol";

//
contract GreyhoundRacing is Ownable {
	using SafeMath for uint;

	struct PlaceBet{
		uint8 winProbability;//probability of winning 1% -> 100%
		uint8 prizeRate;//ex: x0, x2, x5....
	}

	struct Bet{
		address player;
		uint8 bet_place;
		uint bet_amount;
		uint8 result_place;
		uint win_amount; 
		uint time;
	}

	mapping(uint8 => PlaceBet) public placeBets;
	mapping(uint => Bet) public bets;

	uint private randomFactor;
	uint private totalUserBets;
	uint private totalUserWin;

	uint public currentBet;
	uint public gameMaxBet;
	uint public gameMinBet;
    uint public totalPlace;

	event UserBet(address indexed player, uint8 bet_place, uint bet_amount, uint8 result_place, uint win_amount, uint id);

	//contract constructor
	constructor() public {
		randomFactor = now.mod(10);
		gameMaxBet = 2000000000;//2000 TRX
		gameMinBet = 1000000;//1 TRX
	    totalPlace = 6;
		placeBets[1] = PlaceBet({winProbability: 24, prizeRate: 15});//15 = x1.5
		placeBets[2] = PlaceBet({winProbability: 22, prizeRate: 18});//
		placeBets[3] = PlaceBet({winProbability: 18, prizeRate: 20});
		placeBets[4] = PlaceBet({winProbability: 16, prizeRate: 22});//
		placeBets[5] = PlaceBet({winProbability: 12, prizeRate: 25});
		placeBets[6] = PlaceBet({winProbability: 8, prizeRate: 30});//x3
		// 6 placeBet => total winProbability = 100 (100%)
		//
	}

	function setPlaceBets(uint8[] win, uint8[] prize) public onlyOwner returns(uint){
	    totalPlace = win.length;
	    if (win.length != prize.length) revert("Error win.length != prize.length.");
	    uint totalWin = 0;
	    for(uint8 i = 0; i < totalPlace; i++){
	        totalWin = totalWin.add(win[i]);
	        if (prize[i] > totalPlace.mul(3)) revert("Error prize > totalPlacex3.");
	        placeBets[i] = PlaceBet({winProbability: win[i], prizeRate: prize[i]});
	    }
	    if (totalWin != 100) revert("Error totalWin != 100.");
	    return totalPlace;
	}

	function getMaxPrizeRate() public view returns(uint8) {
		uint8 maxRate = 0;
	    for(uint8 i = 1; i <= totalPlace; i++){
	        if(placeBets[i].prizeRate > maxRate)maxRate = placeBets[i].prizeRate;
	    }
        return maxRate;
	}

	//
	function userBet(uint8 betPlace, uint amount) public payable returns(uint8){
		if (msg.value < amount) revert("You not enough TRX provided.");
		if (amount < gameMinBet) revert("You place the bet amount smaller than the minimum amount.");
		if (amount > gameMaxBet) revert("You set the bet amount greater than the maximum amount.");
		if (amount.mul(getMaxPrizeRate()).div(10) > address(this).balance) revert("This contract not enough TRX provided.");
        totalUserBets = totalUserBets.add(amount);
		uint random_number = random_uint();
		randomFactor = randomFactor.add(random_number.mod(10).add(1));
		uint result_number = random_number.mod(100);
		//
		uint8 result_place = 0;
		uint smallNum = 0;
	    uint bigNum = 0;
	    for(uint8 i = 1; i <= totalPlace; i++){
	        bigNum = bigNum.add(placeBets[i].winProbability);
			if(result_number >= smallNum && result_number < bigNum){
				result_place = i;
				break;
			}
			smallNum = bigNum;
	    }
		//
		uint win_amount = 0;
		if(result_place == betPlace){
			win_amount = amount.mul(placeBets[result_place].prizeRate).div(10);
			totalUserWin = totalUserWin.add(win_amount);
			msg.sender.transfer(win_amount);
		}
		bets[currentBet] = Bet({
			player: msg.sender,
			bet_place: betPlace,
			bet_amount: amount,
			result_place: result_place,
			win_amount: win_amount,
			time: now
		});
        uint id = currentBet;
		emit UserBet(msg.sender, betPlace, amount, result_place, win_amount, id);
		currentBet++;
		return result_place;
	}

	function getRandomFactor() public onlyOwner view returns(uint) {
        	return randomFactor;
	}

	function setRandomFactor(uint num) public onlyOwner {
        	randomFactor = num;
	}

	function getTotalUserBets() public onlyOwner view returns(uint) {
        	return totalUserBets;
	}

	function getTotalUserWin() public onlyOwner view returns(uint) {
        	return totalUserWin;
	}


	function setGameMaxBet(uint num) public onlyOwner {
        	gameMaxBet = num;
	}

	function setGameMinBet(uint num) public onlyOwner {
        	gameMinBet = num;
	}
	//random
	function random_uint() private view returns (uint256) {
		return uint256(blockhash(block.number-1-block.timestamp.mod(100))) + randomFactor;
	}

	//withdraw
	function withdraw(uint amount) public onlyOwner {
		require(amount <= address(this).balance);
		owner().transfer(amount);
	}

    function() public payable{}
}
