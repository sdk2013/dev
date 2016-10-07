/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('unit_miner');
 * mod.thing == 'a thing'; // true
 */

var miner = {
    beforeAge: function(){
        var creep = this.creep;
        var spawner = require('spawner')
        spawner.addToQueue("miner", 1, {"role":"miner", "target": creep.memory.target}, -1, false);
        delete Memory.creeps[creep.name];
    },
	behavior: function(){
	    var creep = this.creep    
	    var target = creep.memory.target
	    target = Game.getObjectById(target)
	    result = creep.harvest(target);
	    creep.moveTo(target)
	    creep.drop("energy")
	},
	
	onSpawn: function(){},

	partWeights: function(){
	    var unitWeight = [["work", 4],["carry",1],["move",2]];
	    return unitWeight;
	},
	/**
     * Calculates the composition of a creep based on extensions in a room
     * @param: {integer} Number of extensions availible to spawning spawn
     * returns: [[2darray]] of PARTS and NUMBER OF PARTS in form [[PART, {integer}],[PART, {integer}]]
     */
    partWeightsExt: function(extensionCount){
        if(extensionCount <= 5){                                     // < 300 max energy avail
            var unitWeight = [["work", 2],["carry", 1],["move",1]];     // cost: 300
        }else if(extensionCount <= 10){                              // < 550 max energy avail
            var unitWeight = [["work", 3],["carry", 1],["move",3]];     // cost: 500 
        }else if(extensionCount <= 20){                              // < 800 max energy avail
            var unitWeight = [["work", 5],["carry", 1],["move",3]];     // cost: 700
        }else{                                                      // 1300 max energy
            var unitWeight = [["work", 5],["carry", 1],["move",3]];     // cost: 700
        }
        return unitWeight;
    }
};

module.exports = miner;