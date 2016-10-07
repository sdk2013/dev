/*

Mk II 1.0.09 CHANGELOG:

ADDED:
Introduction of extension based creep assembly

WIP:
Introduction of task based architecture



BUGFIXES:
command module should no longer run creeps with wrong module when current creep module is unavailible
    Pretty sure when it couldn't construct a module, it was continuing with the previous creep's module
SCVs no longer default to collection, and no longer continue collecting once full
    PUSHED to 1.0.08
utilities.returnEnergyToBase should be fixed

*/
var command = require('command')
var produce = require('produce')
var defend = require('defend')
var spawner = require('spawner')
var statWrapper = require('stat_wrapper')
global._ = require('lodash')
global.utilities = require('utilities')
global.Empire = require('Empire')

module.exports.loop = function () {
    Memory.stats = {};
    statWrapper(initialize);
    command(Game.creeps);
    produce(Game.spawns);
    defend(Game.structures);
    
    //GARBAGE COLLECTION
    try{
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
            if(Memory.creeps[i].role=='testcreep'){
                Game.creeps[i].suicide()
            }
        }
    }catch(e){
        console.log("Error in garbage collection")
    }
    var stats = require("collect_stats");
    stats.run();
    Memory.stats.cpu.used = Game.cpu.getUsed();
}


function initialize(){

    
    
    Creep.prototype.pull = function(target, resource){
        var creep = this
        if(target instanceof Structure){
            var result = creep.withdraw(target, resource)
        }else if(target instanceof Creep){
            var result = target.transfer(creep, resource)
        }
        if(result == -7){
            console.log(creep.name + " pull failed. Target: " + target.id + "  Resource: " + resource)
        }
        return result;
    }
    
    Creep.prototype.pull = function(target){
        var creep = this
        if(target instanceof Structure){
            var result = creep.withdraw(target, RESOURCE_ENERGY)
        }else if(target instanceof Creep){
            var result = target.transfer(creep, RESOURCE_ENERGY)
        }
        if(result == -7){
            console.log(creep.name + " pull failed. Target: " + target.id + "  Resource: Energy (default)")
        }
        return result;
    }
    Structure.prototype.totalEnergy = function(){
        var s = this;
        if(s instanceof StructureTower || s instanceof StructureExtension || 
            s instanceof StructureLab || s instanceof StructureLink || 
            s instanceof StructureNuker || s instanceof StructurePowerSpawn ||
            s instanceof StructureSpawn){
            return s.energy
        }
        if(s instanceof StructureStorage || s instanceof StructureContainer ||
            s instanceof StructureTerminal){
            var energytotal = s.store[RESOURCE_ENERGY]
            if(!energytotal == null){
                return energytotal
            }else{
                return 0;
            }
        }
        return null;
    }
    Creep.prototype.toSay = function(thingToSay){
        var creep = this
        creep.memory.toSay = creep.memory.toSay + thingToSay
    }
    Creep.prototype.total = function(){
        var creep = this;
        var total = _.sum(creep.carry);
        return total;
    }
}
/*KNOWN BUGS:

Spawning a creep using priority queue deletes memory
*/