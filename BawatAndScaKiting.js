setInterval(function(){
    if(in_attack_range(get_player('Vynora'))){
        for(var i = 3; i < 50; i++){if(character.items[i] != null)send_item('Vynora', i, 100)}
    }
}, 10000);

var attacker = null;
var ringRadius = 120;
var idealKiteRing = null;
function findIdealLocation(){
    if(idealKiteRing == null){
        //Calculate valid map positions that are RADIUS away from both me and the walls
		var positions;
        var positionsWhereCircleCanFit = [];
		for(; ringRadius > 20 && positionsWhereCircleCanFit.length == 0; ringRadius -= 10){
			var positions = getMapPositionsWithinPlayerRadius(ringRadius);
			var positionsWhereCircleCanFit = positions.filter(circlePosition => {
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
		}
        

        //Choose any one - I'm not picky
        idealKiteRing = {};
        idealKiteRing.center = {};
        idealKiteRing.center.x = positionsWhereCircleCanFit[0].x;
        idealKiteRing.center.y = positionsWhereCircleCanFit[0].y;

    }

    //Find furthest position on ring from bat within 50 pixel of character's current position
    var pointsToMoveTo = collisionPoints(
        {x: idealKiteRing.center.x, y: idealKiteRing.center.y, radius: ringRadius},
        {x: character.x, y: character.y, radius: 35}
    );

    return pointsToMoveTo;
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
function collisionPoints({
    x: x1,
    y: y1,
    radius: r1
}, target) {
    const x2 = target.x;
    const y2 = target.y;
    const r2 = target.radius;

    const centerdx = x1 - x2;
    const centerdy = y1 - y2;
    const R = Math.sqrt(centerdx * centerdx + centerdy * centerdy);
    if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) {
        return [];
    }

    const R2 = R*R;
    const R4 = R2*R2;

    const a = (r1*r1 - r2*r2) / (2 * R2);
    const r2r2 = (r1*r1 - r2*r2);
    const c = Math.sqrt(2 * (r1*r1 + r2*r2) / R2 - (r2r2 * r2r2) / R4 - 1);

    const fx = (x1 + x2) / 2 + a * (x2 - x1);
    const gx = c * (y2 - y1) / 2;

    const fy = (y1+y2) / 2 + a * (y2 - y1);
    const gy = c * (x1 - x2) / 2;

    return [{
        x: fx + gx,
        y: fy + gy
    }, {
        x: fx - gx,
        y: fy - gy
    }];
}

var fighting = null;
setInterval(function(){
	
	var fighter1 = get_player('GolAcheron');
    var fighter2 = get_player('Mithrarin');

    if(character.mp < character.max_mp * 0.75){
       use('use_mp');
    }
    if(character.hp < character.max_hp * 0.75){
       use('use_hp');
    }

    loot();

    if (fighter1.hp < fighter1.max_hp * 0.75 && in_attack_range(fighter1)) {
        heal(fighter1);
    }

    if (fighter2.hp < fighter2.max_hp * 0.75 && in_attack_range(fighter2)) {
        heal(fighter2);
    }
	
	if(fighting != null && (fighting.dead || get_target_of(fighting) != character)){
		fighting = null;
	}
	
	if(fighting == null){
		var toFight = get_nearest_monster();
		
		if(!in_attack_range(toFight)){
			move(
                character.x+(toFight.x-character.x)/1.2,
                character.y+(toFight.y-character.y)/1.2
            );
			return;
		}
		
		attack(toFight);
		
		fighting = toFight;
	}
	
    var idealLocations = findIdealLocation();
	var highestDistanceIndex = -1;
	var highestDistance = 0;
	for(var i = 0; i < idealLocations.length; i++){
		var combatDistance = distance(idealLocations[i], fighting);
		if(combatDistance > highestDistance){
			highestDistanceIndex = i;
			highestDistance = combatDistance;
		}
	}
	
    move(
        idealLocations[highestDistanceIndex].x,
        idealLocations[highestDistanceIndex].y
    );

},1000 * 0.25);
