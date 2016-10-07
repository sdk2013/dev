/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */
/*
Module Type: Production Management

I'm not actually happy with this module at the moment. I want the ability to either build units at the first availible spawner, the spawner(s) in a room nearest a point/room, or at a specific spawner.
For all intents and purposes, I might want to consider the second two to be identical.

Current thought process: Maintain current structure, but pass in "Nearest room" metric?
Problem: Two immediate rooms for a distant trip- initial spawn less relevant
    Temp Fix: 
Problem: Requires multiple parse throughs for each spawner?
    Solution: One parse through, checking the ideal spawn location of each item and assigning as necessary. Break out of the parse once each spawner has been assigned
        Problem: Poor optimization?
            Comment: Items towards the front of the array have higher priority anyway, at least in theory, so this may be moot
        Problem: Computation heavy?
            Comment: It may be most efficient to simply figure by the number of spawners in each room, then figure the assignments from there (i.e. don't assign within rooms?)
                Problem: This requires *another* memory layer, which may be unecessarily overcomplicating things, and I'm not sure I can pass objects from one to another without some sort of reparsing.
                Problem: This might light my memory on fire if my garbage collection isn't good, and even then...


*/
var _ = require('lodash');
module.exports = {
    initSpawnQueue: function(){
        if(Memory.spawnQueue == undefined){
            Memory.spawnQueue = [];
        }
    },
    /*A Note about the following:
    * Spawner Memory is designed to hold precisely one object at a time, which it will try to build every cycle if it can
    * However, it is an array so that, in the event of an emergency, manual control, etc. I can add units to a spawners
    * individual queue without having to have it filter through the spawn queue and hope it distributes to the right spawner
    */
    initSpawnerInternalQueue: function(spawn){
        if(spawn.memory.Queue == undefined){
            spawn.memory.Queue = [];
        }
    },
    addToQueue: function(unitType, scaling, memoryObject, targetRoomId, priority){
        this.initSpawnQueue();
        var unitProdObject = {}
        unitProdObject.unitType = unitType;
        unitProdObject.memoryObject = memoryObject;
        unitProdObject.scaling = scaling;
        unitProdObject.targetRoomId = targetRoomId;
        if(priority == true){
            Memory.spawnQueue.push(unitProdObject)
        }else{
            Memory.spawnQueue.unshift(unitProdObject)
        }
    },
    
    //THIS IS WIP
    //TODO: Set up secondary variable for the length of the queue for each room- dict lookup rather than full array parse
    assignToSpawner: function(spawns){
        if(Memory.spawnQueue != []){    //Only Run if something's in Queue
            for(var name in spawns){
                var spawn = spawns[name]
                this.initSpawnerInternalQueue(spawn);   
                if(spawn.spawning == null || spawn.memory.Queue.length == 0){   //Only run if spawner is not currently in use                                   <<< THIS SHITS BROKE NO IDEA WHY
                    for(var h in Memory.spawnQueue){
                        var i = Memory.spawnQueue[h];
                        if(Game.getObjectById(i.targetRoomId) == spawn.room || i.targetRoomId == -1){ //If this is the right room
                            var backup = _.cloneDeep(i);
                            console.log("ASSIGNED")
                            spawn.memory.Queue.push(backup);
                            Memory.spawnQueue.splice(h, 1);
                            break;
                        }
                    }
                }
            }
        }
    }
    
};