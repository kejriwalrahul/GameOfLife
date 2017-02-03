var xdim, ydim;
var player;

function generate(){
	var x = document.getElementById('x').value;
	var y = document.getElementById('y').value;

	xdim = x;
	ydim = y;

	var c = document.getElementById('container');
	var str = "";
	var i,j;

	var w = 600/x;

	str += "<br><br><table class='table col-md-12' style=\"width: 600px\">\n";
	for(i=1;i<=x;i++){
		str += "<tr>\n";
		for(j=1;j<=y;j++){
			str += "<td class='cell' id='" + i + "," + j + "' onclick=\"toggle('" + i + "," + j +"')\" style='width:" + w + "px;'>";
			str += "0";
			str += "</td>\n";
		}
		str += "</tr>\n";
	}
	str += "</table>\n";
	c.innerHTML = str;
	// console.log(str);
}

function toggle(x){
	var cell = document.getElementById(x);
	if(cell.innerHTML == 1){
		cell.className = "cell";
		cell.innerHTML = 0;
	}
	else{
		cell.className = "cell live";
		cell.innerHTML = 1;
	}
}

function currentState(){
	var currState = [];

	var i,j,row;

	row = []
	for(i=0;i<=ydim+1;i++)
		row.push(0);
	currState.push(row);

	for(i=1;i<=xdim;i++){
		row = [0];

		for(j=1;j<=ydim;j++){
			row.push(document.getElementById(i + "," + j).innerHTML);
		}
		row.push(0);

		currState.push(row);
	}

	row = []
	for(i=0;i<=ydim+1;i++)
		row.push(0);
	currState.push(row);

	return currState;
}

function liveNeighbourCount(currState, x, y){
	var xoffsets = [-1, -1, -1,  0,  0, +1, +1, +1];
	var yoffsets = [-1,  0, +1, -1, +1, -1,  0, +1];

	var count = 0;
	for(i=0;i<xoffsets.length;i++){
		if(currState[x+xoffsets[i]][y+yoffsets[i]] == 1)
			count++;
	}

	return count;
}

function genNextState(currState){
	var nextState = currState.map(function(arr) {
    	return arr.slice();
	});

	var i,j;
	for(i=1;i<=xdim;i++){
		for(j=1;j<=ydim;j++){
			
			var newval = 0;
			var neighbors = liveNeighbourCount(currState, i, j);

			if(currState[i][j]==1 && (neighbors == 2 || neighbors == 3))
				newval = 1;
			else if(currState[i][j]==0 && neighbors == 3)
				newval = 1;

			nextState[i][j] = newval;
		}
	}

	return nextState;
}

function updateState(){
	var currState = currentState();
	var nextState = genNextState(currState); 

	for(i=1;i<=xdim;i++)
		for(j=1;j<=ydim;j++){
			if(currState[i][j] == 1) 	document.getElementById(i + "," + j).className = "cell";
			if(nextState[i][j] == 1)	document.getElementById(i + "," + j).className = "cell live";

			document.getElementById(i + "," + j).innerHTML = nextState[i][j];
		}
}

function play(){
	var speed = document.getElementById('playspeed').value;
	var delay = 1000.0/speed;

	console.log(delay);
	player = setInterval(updateState, delay);
}

function stop(){
	clearInterval(player);
}