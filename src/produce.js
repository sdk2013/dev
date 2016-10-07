/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('produce');
 * mod.thing == 'a thing'; // true
 */
var utilities = require('utilities')
var spawner = require('spawner')
module.exports = function(spawns){
    try{
        spawner.initSpawnQueue();
        spawner.assignToSpawner(spawns);
        
        for(var name in spawns){
            var spawn = Game.spawns[name];
            if(spawn.spawning){
                break;
            }
            if(spawn.memory.Queue==undefined || spawn.memory.Queue[0]==null){
                break;
            }
            var nextCreepInQueue = utilities.peek(spawn.memory.Queue);
            var nextRole = nextCreepInQueue.unitType;
            if(nextRole == true){spawn.memory.Queue.pop()};
            var extensionCount = utilities.roomExtCount(spawn);
            var creepParts = utilities.assembleCreep(nextRole, extensionCount);
            var result = spawn.canCreateCreep(creepParts)
            if(result == OK){
                console.log(spawn.name + " is building "+nextRole);
                spawn.memory.Queue.pop();
                spawn.createCreep(creepParts, utilities.uid() + " - " + nextRole, nextCreepInQueue.memoryObject);
            }else if(result == ERR_NOT_ENOUGH_ENERGY){
                console.log(spawn.name + " cannot build " + nextRole + "!  Insufficient funds. " + spawn.room.energyAvailable + "/" + spawn.room.energyCapacityAvailable + ". Cost: " + utilities.creepCost(creepParts))
            }else{
                console.log("Error: " + result + "   Output: " +creepParts + "   Args: " + nextRole + ", "+nextScaling)
                //console.log(spawn.name+" cannot build " + nextRole + " : Funds availible: "+ spawn.energyAvailable+"/"+ spawn.energyCapacityAvailable + "   Unit Cost: "+ utilities.creepCost(creepParts));
                
            }
        }
    }catch(e){
        console.log("Production Error: " + e + " : " + e.stack)
    }
};