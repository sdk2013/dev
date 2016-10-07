/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('Empire');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    buildCreep: function(unitType, memoryObject){
        if(memoryObject == undefined || memoryObject == null){
            memoryObject = {role: unitType}
        }
        var spawner = require('spawner')
        try {  
            spawner.addToQueue(unitType, 1, memoryObject, -1, false)
            return unitType + " added to queue."
        } catch(e) { 
            console.log("Buildcreep requires: unitType, scaling, [memoryObject], [targetRoomId], priority")
        };
    },
    dumpSpawnQueue: function(spawnName){
        Game.spawns[spawnName].memory.Queue = []
    },
    test: function(){
        var scv = require("unit_scv"); 
        var x = scv.partWeights(); 
        var output = "";
        for(var y in x){		
    	    for(var i = 0; i<y[1];i++){
    		output=output+i[0];
    		console.log("I: " +i[0])
        	}
        }
        console.log(output)
    }
};