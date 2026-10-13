//Transfer my items to Bawat
setInterval(function(){
	if(in_attack_range(get_player('Bawat'))){
		for(var i = 3; i < 50; i++){if(character.items[i] != null)send_item('Bawat', i, 100)}
	}
}, 10000);

load_code('RunBackAfterDeath');

var lockedTarget = null;

setInterval(function(){
	
	//Use potions if below half bar
	if(character.mp < character.max_mp * 0.50){
		use('use_mp');
	}	
	if(character.hp < character.max_hp * 0.50){
		use('use_hp');
	}

	//Loot loot patoot
	loot();
	
	var me = get_player('Bawat');
	var master = get_player('Bawat');
	
	//If we're not supporting
	if(master === null || distance(me, master) > 300){
	   move(
			character.x+(me.x-character.x),
			character.y+(me.y-character.y)
			);
		return;
	}
	
	
	if(lockedTarget != null && lockedTarget.hp == 0){
		lockedTarget = null;
	}
	if(lockedTarget == null){
		var mastersTarget = get_target_of(master);
		if(mastersTarget != null && mastersTarget.hp < mastersTarget.max_hp && mastersTarget.type == 'monster'){
			lockedTarget = mastersTarget;
		}
	}
	if(lockedTarget !== null){
		
		if(!in_attack_range(lockedTarget))
		{
			move(
				character.x+(lockedTarget.x-character.x)/2,
				character.y+(lockedTarget.y-character.y)/2
				);
		}
		attack(lockedTarget);
	}else{
		if(distance(character, master) > 50){
			move(
				character.x+(master.x-character.x)/2,
				character.y+(master.y-character.y)/2
				);
		}
	}

},1000/4);
