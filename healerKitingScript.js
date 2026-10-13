load_code('RunBackAfterDeath');

setInterval(function(){
	if(in_attack_range(get_player('Vynora'))){
		for(var i = 3; i < 50; i++){if(character.items[i] != null)send_item('Vynora', i, 100)}
	}
}, 10000);

var attacker = null;
var ringRadius = 60;
var idealKiteRing = null;
function findIdealLocation(){
	if(idealKiteRing == null){
		//Calculate valid map positions that are RADIUS away from both me and the walls
		
		var positions = getMapPositionsWithinPlayerRadius(ringRadius);
		var positionWhereCircleCanFit = positions.filter(circlePosition => {
			//If nothing on the circle collides with walls -> keep point
			var collision = false;
			for(var angle = 0; angle < 2*Math.PI && !collision; angle+= (2*Math.PI)/8){
				var dx = ringRadius * Math.cos(angle);
				var dy = ringRadius * Math.sin(angle);
				var x = circlePosition.x + dx;
				var y = circlePosition.y + dy;
				
				collision = !can_move_to(x, y);
			}
			
			return !collision;
		});
		
		//Choose any one - I'm not picky
		idealKiteRing = {};
		idealKiteRing.center = {};
		idealKiteRing.center.x = positionWhereCircleCanFit[0].x;
		idealKiteRing.center.y = positionWhereCircleCanFit[0].y;
		
	}
	
	//Find furthest position on ring from bat within 50 pixel of character's current position
	
	var pointsToMoveTo = collisionPoints(
		{x: character.x, y: character.x,radius: 10}, 
		{x: idealKiteRing.center.x, y: idealKiteRing.center.x,radius: ringRadius}
	);
	
	draw_circle(pointsToMoveTo[0].x, pointsToMoveTo[0].y, 10);
	
	return pointsToMoveTo[0];
}
function getMapPositionsWithinPlayerRadius(radius){
	var x = character.x;
	var y = character.y;
	var pointList = [];
	for(var angle = 0; angle < 2*Math.PI; angle+= (2*Math.PI)/128){
		var dx = radius * Math.cos(angle);
		var dy = radius * Math.sin(angle);
		pointList.push({x: x + dx, y: y + dy});
	}
	return pointList;
}

function calculateAngle(source, target) {
    return Math.atan2(
        (source.y - target.y),
        (source.x - target.x)
    );
};
function collisionPoints(source, target) {
    const dist = distance(target, source);
    const angle = calculateAngle(source, target);
    const theta = Math.acos(2 * source.radius / dist);
    
    return [
        angle - theta,
        angle + theta
    ];
}


setInterval(function(){
	var idealLocation = findIdealLocation();
	
	move(
		idealLocation.x,
		idealLocation.y
	);
	
	return;
	
	var fighter1 = get_player('GolAcheron');
	var fighter2 = get_player('Mithrarin');

	if(character.mp < character.max_mp * 0.75){
	   use('use_mp');
	}	
	if(character.hp < character.max_hp * 0.75){
	   use('use_hp');
	}
	
	loot();

	if (fighter1.hp < fighter1.max_hp * 0.75) {
		if(!in_attack_range(fighter1)){
			move(
				character.x+(fighter1.x-character.x)/2,
				character.y+(fighter1.y-character.y)/2
			);
			return;
		}
		heal(fighter1);
		return;
	}

	if (fighter2.hp < fighter2.max_hp * 0.75) {
		if(!in_attack_range(fighter2)){
			move(
				character.x+(fighter2.x-character.x)/2,
				character.y+(fighter2.y-character.y)/2
			);
			return;
		}
		heal(fighter2);
		return;
	}

},1000 * 0.25);

