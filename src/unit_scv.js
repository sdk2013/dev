/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('unit_scv');
 * mod.thing == 'a thing'; // true
 */

/*
NAME: SCV
ROLE: Multirole Worker
COST: Low
Characteristics:

WIP:
Gathers resources and brings them back to spawn 

Planned:
Execute Build Orders - DONE (SORT OF)
Return to extensions & Storage
 */
var _ = require('lodash')
var utilities = require('utilities')
var scv = {
    behavior: function(){
        var creep = this.creep
        var job = creep.memory.job
        var total = _.sum(creep.carry);
        if(total = creep.carryCapacity){
            creep.memory.empty = false;
        }
        //If Idle, I want this guy to go back to mining
        if(!creep.memory.job || (creep.room.controller.level > 3 && creep.memory.job == 'collection'))
            creep.memory.job = utilities.rerollJob(creep);
        if(!creep.memory.empty && creep.room.controller.level == 1){
            creep.memory.job = "resource gathering"
        }
        if(!creep.memory.empty && creep.memory.job == "collection"){
            creep.memory.job = "construction"
        }
        //Overall Job Logic
        
        switch(job){
            case 'resource gathering':
                utilities.jobResourceGathering(creep);
                break;
            case 'construction':
                creep.toSay("B-")
                utilities.jobLocalConstruction(creep);
                break;
            case 'RCL':
                creep.toSay("U-")
                utilities.jobRCLUpgrading(creep);
                break;
            case 'collection':
                utilities.jobCollection(creep);
                break;
            default:
                utilities.rerollJob(creep);
        }
    },
    partWeights: function(){
        var unitWeight = [["work", 1],["carry", 2],["move",2]];
        return unitWeight;
    },
    /**
     * Calculates the composition of a creep based on extensions in a room
     * @param: {integer} extensionCount - Number of extensions availible to spawning spawn
     * returns: [[2darray]] of PARTS and NUMBER OF PARTS in form [[PART, {integer}],[PART, {integer}]]
     */
    partWeightsExt: function(extensionCount){
        if(extensionCount <= 5){                                     // < 300 max energy avail
            var unitWeight = [["work", 1],["carry", 2],["move",2]];     // cost: 300
        }else if(extensionCount <= 10){                              // < 550 max energy avail
            var unitWeight = [["work", 3],["carry", 2],["move",3]];     // cost: 550 
        }else if(extensionCount <= 20){                              // < 800 max energy avail
            var unitWeight = [["work", 3],["carry", 3],["move",5]];     // cost: 700
        }else{                                                      // 1300 max energy
            var unitWeight = [["work", 4],["carry", 4],["move",8]];     // cost: 1000
        }
        return unitWeight;
    },
    beforeAge: function(){
        var spawner = require('spawner')
        spawner.addToQueue("scv", 1, {role:"scv"}, -1, true)
        
        var creep = this.creep
        delete Memory.creeps[creep.name];
    }
}

module.exports = scv