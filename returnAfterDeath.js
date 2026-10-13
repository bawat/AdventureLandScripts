// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!

//var attack_mode=false

var queuedRunBackPath = [];
var walkedPath = [];

var previousHealth = 'not zero';
var runBackNextLocation = null;

setInterval(function(){
	
	//Follow the path back home
	if(queuedRunBackPath.length !== 0){
	   move(
			character.x+(runBackNextLocation.x-character.x),
			character.y+(runBackNextLocation.y-character.y)
			);
		if(distance(runBackNextLocation, character) < 10){//Check if close enough otherwise stutter-stop
			runBackNextLocation = queuedRunBackPath.shift();
		}
	}
	
	//Respawn handler
	if(character.hp !== 0 && previousHealth === 0){
		queuedRunBackPath = Array.prototype.concat(queuedRunBackPath, walkedPath);
		walkedPath = [];
	   runBack = true;
		runBackNextLocation = queuedRunBackPath.shift();
	}
	//Update previous health
	previousHealth = character.hp;
	
	//Populate into the list of previous positions if they're far enough apart
	if(walkedPath.length === 0 || distance(walkedPath[walkedPath.length-1], character) > 50){
		
		//Check to see if our path intersects a previous part of our path
        for (var i = 0; i < walkedPath.length; i++) {
            if(distance(walkedPath[i], character) < 50){
                walkedPath = walkedPath.slice(0, i);
            }
        }
		
		walkedPath.push({x: character.x, y: character.y});
	}
	
}, 1000/7);