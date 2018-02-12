var xdim, ydim;
var cell_width, cell_height;
var player;
var playing = false;

function generate(){
	var x = document.getElementById('x').value;
	var y = document.getElementById('y').value;

	xdim = x;
	ydim = y;
	cell_height = 80/xdim;
	cell_width = 100 / ydim;

	var c = document.getElementById('container');
	var str = "";
	var i,j;

	str += "<table class='table col-md-12 cell_grid' style=\"width: 55vw; height: 90vh; margin-top: 5vh;\">\n";
	for(i=1;i<=x;i++){
		str += "<tr>\n";
		for(j=1;j<=y;j++){
			str += "<td class='cell' id='" + i + "," + j + "' onclick=\"toggle('" + i + "," + j +"')\" style='height: 2px; padding:0;'>";
			str += "";
			str += "</td>\n";
		}
		str += "</tr>\n";
	}
	str += "</table>\n";
	c.innerHTML = str;
}

function toggle(x){
	var cell = document.getElementById(x);
	if(cell.classList.contains('live')){
		cell.className = "cell";
	}
	else{
		cell.className = "cell live";
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
			if (document.getElementById(i + "," + j).classList.contains('live'))
				row.push(1);
			else
				row.push(0);
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

			// document.getElementById(i + "," + j).innerHTML = nextState[i][j];
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

function play_toggle(){
	if(playing){
		playing = false;
		stop();
		document.getElementById('play_toggle').innerHTML = 'Play';
	}
	else{
		playing = true;
		play();
		document.getElementById('play_toggle').innerHTML = 'Stop';
	}
}

function randomize(){
	for(var idx=1; idx<=xdim; idx++)
		for(var idy=1; idy<=ydim; idy++){
			// Toggle randomly
			if(Math.random() > 0.5){
				var curr_cell = document.getElementById(idx+","+idy); 
				if(curr_cell.classList.contains('live'))
					curr_cell.className = "cell";
				else
					curr_cell.className = "cell live";
			}
		}
}

function init(){
	document.getElementById('x').value = 30;
	document.getElementById('y').value = 30;
	document.getElementById('playspeed').value = 5;
	generate();
	randomize();	
}