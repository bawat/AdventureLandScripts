function calculateAngle(source, target) {
    return Math.atan2(
        (source.y - target.y),
        (source.x - target.x)
    );
}
function calcPolar(target, source = character) {
    return {
        distance: distance(source, target),
        angle: calculateAngle(source, target)
    }
}

function preProcess(entity) {
    return {
        ...calcPolar(entity),
        attack: entity.attack,
        level: entity.level,
        hp: entity.hp,
    };
}
function findMax(keys, array) {
    const maxValues = {};

    keys.forEach(key => {
        maxValues[key] = Number.MIN_SAFE_INTEGER;
    })

    array.forEach(object => keys.forEach(key => {
        if (typeof object[key] === 'number') {
            maxValues[key] = (
                object[key] > maxValues[key] ?
                object[key] : maxValues[key]
            );
        }
    }))

    return maxValues;
}
function calcProbs(keys, array, max) {
    const out = array.map(object => {
        const out = {};
        keys.forEach(key => {
            if (
                typeof max[key] === 'number' &&
                typeof object[key] === 'number'
            ) {
                out[key] = object[key] / max[key];
            }
        });

        return out;
    });

    return out;
}

function sumKey(key) {
    return (carry, obj) => carry + obj[key];
}
function reduceAD(carry, {danger, angle}) {
    return carry + (danger * angle);
}
function calculateDanger(multipliers) {
    const keys = Object.keys(multipliers);
    return target => ({
        danger: keys.reduce((carry, key) => (
            carry * multipliers[key](target[key])
        ), 1),
        angle: target.angle
    })
}
function findSafestAngle(hostiles, multi = {}) {
    hostiles = hostiles
        .map(preProcess);

    const keys = Object.keys(multi);
    const max = findMax(keys, hostiles);

    // Calculate danger levels
    const probs = calcProbs(keys, hostiles, max).map(
        (entity, index) => ({...entity, angle: hostiles[index].angle})
    );
    const dangers = probs.map(calculateDanger(multi));

    const totalDanger = dangers.reduce(sumKey('danger'), 0);
    const totalWeightedAngle = dangers.reduce(reduceAD, 0);

    // Calculate worst direction
    return (totalWeightedAngle / totalDanger);
}
function findWorstAngle(...args) {
    return Math.PI + findWorstAngle(...args);
}
	
setInterval(function(){
	
	const hostiles = Object.values(parent.entities)
		.filter(thing => (
			thing.type === 'monster' &&
			distance(character, thing) < 300
		));
	const angle = findSafestAngle(hostiles, {
		distance: value => -Math.log10((value / 2) + 0.1),
		attack:   value => value ** 0.35,
		level:    value => value,
		hp:       value => value ** 2
	});

	const dist = 40;
	const x = character.x + dist * Math.cos(angle);
	const y = character.y + dist * Math.sin(angle);

	// RUN AWAY!
	move(x, y);

},1000 * 0.25);

