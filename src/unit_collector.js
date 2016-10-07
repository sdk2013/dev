/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('unit_collector');
 * mod.thing == 'a thing'; // true
 */
var utilities = require('utilities')
var collector = {
    beforeAge: function(){
        var creep = this.creep;
        var spawner = require('spawner');
        spawner.addToQueue("collector", 1, {role:"collector"}, -1, false)
        delete creep.memory;
    },
	
	behavior: function(){
        var creep = this.creep
        if(_.sum(creep.carry) == 0){
            creep.memory.full = false;
        }
        if(!creep.memory.full){
            creep.toSay("E")
            if(Game.getObjectById(creep.memory.target) == undefined || Game.getObjectById(creep.memory.target) == null){
                creep.toSay(":NT")
                var target = creep.room.find(FIND_DROPPED_RESOURCES)
                if(target[0]){
                    creep.memory.target = target[0].id;
                }else{
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: function(s){
                                return (s.structureType == STRUCTURE_CONTAINER &&
                                        _.sum(s.store) > 250)}});
                    if(target != null){
                        creep.memory.target = target.id;
                    }
                }
            }
            
            var target = Game.getObjectById(creep.memory.target)
            var result = creep.pickup(target)
            if(result == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }else if(result == ERR_FULL){
                creep.memory.full = true;
            }else if(result == ERR_INVALID_TARGET){
                delete creep.memory.target;
            }
            creep.toSay(result)
        }else{
            creep.toSay("F")
            utilities.returnEnergyToBase(creep, true);
        }
	},
	
	onSpawn: function(){},

	partWeights: function(){
	    var unitWeights = [["move",3],["carry",3]]
	    return unitWeights;
	},
	/**
     * Calculates the composition of a creep based on extensions in a room
     * @param: {integer} extensionCount - Number of extensions availible to spawning spawn
     * returns: [[2darray]] of PARTS and NUMBER OF PARTS in form [[PART, {integer}],[PART, {integer}]]
     */
    partWeightsExt: function(extensionCount){
        if(extensionCount <= 5){                                     // < 300 max energy avail
            var unitWeight = [["carry", 3],["move",3]];     // cost: 300
        }else if(extensionCount <= 10){                              // < 550 max energy avail
            var unitWeight = [["carry", 5],["move",5]];     // cost: 500 
        }else if(extensionCount <= 20){                              // < 800 max energy avail
            var unitWeight = [["carry", 6],["move",6]];     // cost: 600
        }else{                                                      // 1300 max energy
            var unitWeight = [["carry", 10],["move",10]];     // cost: 1000
        }
        return unitWeight;
    }
}

module.exports = collector;