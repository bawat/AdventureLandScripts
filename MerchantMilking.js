var walking = false;
var upgradeMerchant = get_map().npcs.find(npc => npc.id === 'newupgrade');
var traderMerchant = get_map().npcs.find(npc => npc.id === 'secondhands');

var mainLoop = setInterval(function(){
	var binnedItems = character.items
		.reduce((carry, item, slot) => {
			if (item === null || item.level > 1) 
				return carry;

			var indexName = item.name + item.level;
			if (!carry[indexName])
				carry[indexName] = [];

			carry[indexName].push({...item, slot});

			return carry;
		}, {})

	var upgradables = Object.entries(binnedItems).filter(itemList => itemList[1].length >= 3);


	if(upgradables.length != 0){
	   //walkToCompressor
		if(distance(character, {x: upgradeMerchant.position[0], y: upgradeMerchant.position[1]}) > 50){
			if(walking == "upgradeMerchant"){
				return;
			}
			smart_move(
				character.x+(upgradeMerchant.position[0]-character.x),
				character.y+(upgradeMerchant.position[1]-character.y)
			);
			walking = "upgradeMerchant";
		}else{
			var scroll_num = -1;

			for(var i = 0; i < character.items.length; i++){
				var item = character.items[i];
				if(item != null && item.name == 'cscroll0'){
				   scroll_num = i;
				}
			}
			compound(upgradables[0][1][0].slot, upgradables[0][1][1].slot, upgradables[0][1][2].slot, scroll_num);
			walking = false;
		}
		return;
	}

	//Walk to trader
	if(distance(character, {x: traderMerchant.position[0], y: traderMerchant.position[1]}) > 50){
		if(walking == "upgradeMerchant"){
			return;
		}
		smart_move(
			character.x+(traderMerchant.position[0]-character.x),
			character.y+(traderMerchant.position[1]-character.y)
		);
		walking = "upgradeMerchant";
	}else{
		walking = false;
	}
	
	if(walking != false){
		return;
	}
	console.warn('Clearing interval');
	
	var secondhand_socket = get_socket();
	function getSecondHandItems() {
		return new Promise(function(resolve, reject) {
			setTimeout(reject, 300);
			secondhand_socket.once('secondhands', resolve);

			secondhand_socket.emit('secondhands');
		});
	}

	async function buySecondHandItems(ids, filter = (id, level) => true) {
		function buySecondHandItem(rid) {
			secondhand_socket.emit('sbuy', {rid})
		}
		
		if (typeof ids === 'string') {
			ids = [ids];
		}

		if (Array.isArray(ids) &&
			ids.every(id => typeof id === 'string')
		) {
			const items = await getSecondHandItems();
			const targetItems = items
				.filter(item => ids.includes(item.name))
				.filter(({name, level}) => filter(name, level))
				.map(({rid}) => buySecondHandItem(rid));
		} else {
			throw new TypeError('Cant process "ids"');
		}
	}
	buySecondHandItems(['intamulet', 'intring', 'firestaff', 'intearring', 'intbelt']);

	var currentRegion = parent.server_region;
	var currentIdentifier = parent.server_identifier;
	var serverList = [
		{id: 0, region: 'EU', identifier: 'I'},
		{id: 1, region: 'EU', identifier: 'II'},
		{id: 2, region: 'EU', identifier: 'PVP'},
		{id: 3, region: 'US', identifier: 'I'},
		{id: 4, region: 'US', identifier: 'II'},
		{id: 5, region: 'US', identifier: 'III'},
		{id: 6, region: 'US', identifier: 'PVP'}
	];
	var currentServer = serverList.find(item => item.region == currentRegion && item.identifier == currentIdentifier);
	var serverID = (++currentServer.id) % 7;

	var timeout = 35000;
	if(currentServer.identifier == 'PVP'){
	   timeout = 4000;
	}
	console.warn('Clearing interval');
	clearInterval(mainLoop);

	setTimeout(function(){
		change_server(serverList[serverID].region, serverList[serverID].identifier);
	}, timeout)

}, 1000);