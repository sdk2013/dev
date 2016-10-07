/*
 */
var guard = {
    beforeAge: function(){
        var spawner = require('spawner')
        var creep = this.creep;
        spawner.addToQueue("guard", 1, {role:"guard", target: creep.memory.target}, -1, false);
    },
	
	behavior: function(){
	    var creep = this.creep
	    if(creep.room.find(FIND_HOSTILE_CREEPS).length == 0){
	        var target = Game.flags[creep.memory.target].pos
	        var result = creep.moveTo(target);
	        return result;
	    }
	    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
	    creep.rangedAttack(target)
	    var result = creep.attack(target)
	    if(result == ERR_NOT_IN_RANGE){
	        creep.moveTo(target)
	    }
	    if(creep.hits < creep.hitsMax){
	        //creep.heal(creep);
	    }
	    return result;
	},
	
	onSpawn: function(){
	    var spawner = require('spawner')
	    //spawner.addToQueue("guardbuddy", 1, {role:"guardbuddy", target: creep.id}, -1, false);
	},

	partWeights: function(){
	    return [[MOVE, 1]]
	},
	/**
     * Calculates the composition of a creep based on extensions in a room
     * @param: {integer} Number of extensions availible to spawning spawn
     * returns: [[2darray]] of PARTS and NUMBER OF PARTS in form [[PART, {integer}],[PART, {integer}]]
     */
    partWeightsExt: function(extensionCount){
        if(extensionCount < 5){                                     // < 300 max energy avail
            var unitWeight = [["attack", 1],["move",1]];     // cost: 300
        }else if(extensionCount < 10){                              // < 550 max energy avail
            var unitWeight = [["tough", 2],["move", 3],["attack",4]];     // cost: 500 
        }else if(extensionCount < 20){                              // < 800 max energy avail
            var unitWeight = [["tough", 6],["move", 5],["attack",5]];     // cost: 700
        }else{                                                      // 1300 max energy
            var unitWeight = [["tough", 6],["move", 13],["attack",7]];     // cost: 700
        }
        return unitWeight;
    }
}
module.exports = guard