var scrollMerchant = get_map().merchants.find(merchant => merchant.id === 'scrolls');
var armourMerchant = get_map().merchants.find(merchant => merchant.id === 'basics');
var upgradeMerchant = get_map().npcs.find(npc => npc.id === 'newupgrade');
var movingAlongPath = false;

var armourToUpgrade = 'coat';
var targetUpgradeLevel = 8;

setInterval(function(){
	var inventory = {};
	inventory.emptySlots = 0;
	inventory.itemsBeingUpgraded = 0;
	inventory.lesserUpgradeScrolls = 0;
	inventory.lesserUpgradeScrollsPosition = -1;
	inventory.greaterUpgradeScrolls = 0;
	inventory.greaterUpgradeScrollsPosition = -1;
	var items = character.items;
	
	//Count how many of each important item I have
	for(var i = 0; i < items.length; i++){
		if(items[i] == null){
			inventory.emptySlots++;
			continue;
		}
		switch(items[i].name){
			case 'scroll0':
				inventory.lesserUpgradeScrolls += items[i].q;
				inventory.lesserUpgradeScrollsPosition = i;
				continue;
			case 'scroll1':
				inventory.greaterUpgradeScrolls += items[i].q;
				inventory.greaterUpgradeScrollsPosition = i;
				continue;
			case armourToUpgrade:
				inventory.itemsBeingUpgraded++;
				continue;
			default:
				//Default
		}
	}
	
	//Buy lesser scrolls if I'm out
	if(inventory.lesserUpgradeScrolls < 10){
		if(!in_attack_range(scrollMerchant))
		{
			if(movingAlongPath){
				return;
			}
			smart_move(
				character.x+(scrollMerchant.x-character.x),
				character.y+(scrollMerchant.y-character.y)
				);
			movingAlongPath = true;
		}else{
			buy('scroll0', 300);
			movingAlongPath = false;
		}
		return;
	}
	
	//Buy greater scrolls if I'm out
	if(inventory.greaterUpgradeScrolls < 10){
		if(!in_attack_range(scrollMerchant))
		{
			if(movingAlongPath){
				return;
			}
			smart_move(
				character.x+(scrollMerchant.x-character.x),
				character.y+(scrollMerchant.y-character.y)
				);
			movingAlongPath = true;
		}else{
			buy('scroll1', 100);
			movingAlongPath = false;
		}
		return;
	}
	
	//Buy armour to upgrade if I'm out of armour
	if(inventory.itemsBeingUpgraded === 0){
		if(!in_attack_range(armourMerchant))
		{
			if(movingAlongPath){
				return;
			}
			smart_move(
				character.x+(armourMerchant.x-character.x),
				character.y+(armourMerchant.y-character.y)
				);
			movingAlongPath = true;
		}else{
			for(var i = 0; i < inventory.emptySlots; i++){
				buy(armourToUpgrade, 1);
			}
			movingAlongPath = false;
		}
		return;
	}
	
	//Move to the upgrade merchant and upgrade all the items if they're below a specific level
	if(true){
		if(distance({x: upgradeMerchant.position[0],y: upgradeMerchant.position[1]}, character) > 30)
		{
			if(movingAlongPath){
				return;
			}
			smart_move(
				character.x+(upgradeMerchant.position[0]-character.x),
				character.y+(upgradeMerchant.position[1]-character.y)
				);
			movingAlongPath = true;
		}else{
			var items = character.items;
			for(var i = 0; i < items.length; i++){
				if(items[i] != null && items[i].name === armourToUpgrade && items[i].level < 7){
					upgrade(i, inventory.lesserUpgradeScrollsPosition);
				}
				if(items[i] != null && items[i].name === armourToUpgrade && items[i].level != targetUpgradeLevel){
					upgrade(i, inventory.greaterUpgradeScrollsPosition);
				}
			}
			movingAlongPath = false;
		}
		return;
	}

},1000); // Loops every 1/4 seconds.