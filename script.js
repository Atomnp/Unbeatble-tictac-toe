var origBoard;
const huPlayer='0';
const computer="X";
const winCombos=[
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6]
]
const cells=document.querySelectorAll('.cell');
startGame();

function startGame(){
	document.querySelector(".endgame").style.display="none";
	origBoard=Array.from(Array(9).keys());
	for(var i=0;i<cells.length;i++){
		cells[i].innerText='';
		cells[i].style.removeProperty("background-color");
		cells[i].addEventListener('click',turnClick,false)
	}
}
	function turnClick(param){
		if(typeof origBoard[param.target.id]=="number"){
			turn(param.target.id,huPlayer)
			if (!checkwin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), computer);
				//console.log("turn click"+origBoard)
			//console.log(emptyBox("turn click 2"+origBoard))
		}
		
	}
	function turn(boxId,player){
		origBoard[boxId]=player;// i dont know why this code is written
		document.getElementById(boxId).innerText=player;
		let gamewon=checkwin(origBoard,player);
		if(gamewon) gameover(gamewon);
	}
	function checkwin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}
	function gameover(gamewon){
		//console.log(gamewon)
		//var x=gamewon.player;
        //		//console.log(x) why does this gives undefine
		for(let eachBox of winCombos[gamewon.index]){
			document.getElementById(eachBox).style.backgroundColor=(gamewon.player==huPlayer)?"blue":"green"
		}
		for(var i=0;i<cells.length;i++){
			cells[i].removeEventListener('click',turnClick,false);
		}
			let player=(gamewon.player=='0')? 'human won':'computer won'
			document.querySelector(".endgame").innerText=`gameover ${player} won`;
			document.querySelector(".endgame").style.display="flex";
	}
	function emptyBox(){
		
		return origBoard.filter(box=>typeof box =='number')
	}
	function bestSpot(){

		return minimax(origBoard,computer).index;
	}
	
	function declareWinner(player)
	{
		
		document.querySelector(".endgame").innerText=`gameover ${player}`;
		document.querySelector(".endgame").style.display="block";
	}
	function checkTie(){
		//console.log("in the check tie function definition ");
		if(emptyBox().length==0){
			for(var i=0;i<cells.length;i++){
				cells[i].style.backgroundColor='red';
				cells[i].removeEventListener('click',turnClick,false)
				declareWinner("tie game")

			}
		  return true
	    }	return false
	}
	function minimax(board,player){
		var availableSpots=emptyBox();
		
		if (checkwin(board,huPlayer)){
			return {score:-10}
		}
		else if(checkwin(board,computer)){
			return {score: 10}
		}
		else if(availableSpots.length===0){
			return {score: 0};
		}
		var moves=[];
		for (var i = 0; i < availableSpots.length; i++) {
		var move = {};
		move.index = board[availableSpots[i]];
		board[availableSpots[i]] = player;

		if (player == computer) {
			var result = minimax(board, huPlayer);
			//console.log(result)
			move.score = result.score;
		} else {
			var result = minimax(board, computer);
			//console.log(result)
			move.score = result.score;
		}

		board[availableSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -11;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 11;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}