load_code('RunBackAfterDeath');

setInterval(function(){
	if(in_attack_range(get_player('Vynora'))){
		for(var i = 3; i < 50; i++){if(character.items[i] != null)send_item('Vynora', i, 100)}
	}
}, 10000);
	
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

