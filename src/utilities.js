/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utilities');
 * mod.thing == 'a thing'; // true
 */
var _ = require('lodash');
module.exports = {
    jobCollection: function(creep){
        creep.toSay("CL-")
        var total = _.sum(creep.carry)
        if(total == 0){ creep.memory.empty = true}
        if(!creep.memory.empty){
            creep.toSay("F")
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: function(structure){
                            return (structure.structureType == STRUCTURE_CONTAINER)}})
            creep.repair(target)
            result = this.returnEnergyToBase(creep, false)
            if(result == "ERR_NO_TARGET"){
                creep.memory.job = "contruction"
            }
        }else{
            creep.toSay("E")
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: function(s){
                            return (s.structureType == STRUCTURE_CONTAINER &&
                                    _.sum(s.store) > 150)}});
            result = creep.pull(target)
            
            if(result == ERR_NOT_IN_RANGE){
                creep.moveTo(target)
            }
            if(result == ERR_FULL){
                creep.memory.empty = false;
            }
        }
        return creep.memory.empty
    },
    jobRCLUpgrading: function(creep){
        if(creep.room.controller) {
            result = creep.upgradeController(creep.room.controller)
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);    
            }
            if(result == ERR_NOT_ENOUGH_RESOURCES){
                creep.memory.job = 'collection';
            }
        }
    },
    jobLocalConstruction: function(creep){
        var total = _.sum(creep.carry);
        if(total > creep.carryCapacity *.75){
            creep.memory.noEnergy = false;
            delete creep.memory.refill;
        }
        if(!creep.memory.noEnergy){
            var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
            result = creep.build(sites[0]) 
            if(result == ERR_NOT_IN_RANGE) {
        	        creep.moveTo(sites[0]);    
            }
            if (result == ERR_NOT_ENOUGH_RESOURCES){
                creep.memory.noEnergy = true;
            }
            if(sites.length == 0){
                creep.memory.job = 'RCL';
            }
        }else{
            if(creep.room.controller.level < 3){
                creep.memory.job = "collection";
                return
            }
            creep.toSay("e0")
            if(creep.memory.refill != null && creep.memory.refill != undefined){
                creep.toSay("f")
                var energysource = Game.getObjectById(creep.memory.refill)
                var result = creep.pull(energysource)
                if(result = ERR_NOT_IN_RANGE){
                    creep.moveTo(energysource)
                }
            }else{
                creep.toSay("l")
                creep.memory.refill = this.findEnergy(creep)
                creep.moveTo(Game.getObjectById(creep.memory.refill))
            }
        }
    },
    jobResourceGathering: function(creep){
        var total = _.sum(creep.carry);
        if(total < creep.carryCapacity){
            delete creep.memory.returnTo;
            //console.log(creep.memory.target)
            if(creep.memory.target == undefined){
                var target = null;
                if(!target){
                    target = this.smartChooseSource(creep);
                }
                if(!target){
                    target = creep.pos.findClosestByPath(FIND_SOURCES);
                }
                if(target){
                    creep.memory.target = target.id
                }
            }
            if(creep.memory.target){
                let target = Game.getObjectById(creep.memory.target)
                var movesuccess = creep.moveTo(target);
                result = creep.harvest(target);
                if(result == ERR_NO_PATH){
                    delete creep.memory.target
                }
            }
        }else{
            delete creep.memory.target;
            if(creep.memory.returnTo){
                var home = Game.getObjectById(creep.memory.returnTo);
                var result = creep.transfer(home, RESOURCE_ENERGY) 
                if(result == ERR_NOT_IN_RANGE) {
        	        creep.moveTo(home);
                }
                if(result == ERR_FULL){
                    delete creep.memory.returnTo;
                }
            }else{              //RETURN LOGIC
                var home = null
                if(!home){
                    var spawnHome = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {
                        filter: function(spawner){
                            return spawner.energy < spawner.energyCapacity;
                        }
                    })
                    if(spawnHome){
                        home = spawnHome
                    }
                }
                if(!home){
                    
                    var extHome = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: function(structure){
                            return (structure.structureType == STRUCTURE_EXTENSION &&
                                structure.energy < structure.energyCapacity);
                        }
                    })
                    if(extHome){
                        home = extHome
                    }
                }
                if(!home){
                    
                    if(creep.memory.repeated){
                        creep.memory.repeated ++
                    }else{
                        creep.memory.repeated = 1;
                    }
                    if(creep.memory.repeated > 2){
                        this.rerollJob(creep)
                        delete creep.memory.repeated
                    }
                }else{
                    if(creep.transfer(home, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        	            creep.moveTo(home);
        	            creep.memory.returnTo = home.id;
                    }//this.rerollJob();
                    if(creep.transfer(home, RESOURCE_ENERGY) == ERR_FULL) {
                        delete creep.memory.returnTo;
                    }
                }
            }
        }
    },
    rerollJob: function(creep){
        var total = _.sum(creep.carry);
        switch(creep.room.controller.level){
            case 1:
                creep.memory.job = "RCL"
                break;
            case 2:
                if(Math.random()> 0.25){
                    creep.memory.job = "construction"
                }else{
                    creep.memory.job = "collection"
                }
                break;
            default:
                if(Math.random()> 0.25){
                    creep.memory.job = "construction"
                }else{
                    creep.memory.job = "RCL"
                }
                break;
        }
    },
    uid: function(){
        if(Memory.uid){
            return Memory.uid++;
        }else{
            Memory.uid = 1;
            return 1;
        }
    },
    findNodes: function(){
        var nodes = Game.creeps[this.creep.name].room.find(FIND_SOURCES)
        return nodes;
    },
    mineNearestSource: function(){
		var sources = creep.pos.findNearest(Game.SOURCES);
		creep.moveTo(sources);
		creep.harvest(sources);
    },
    depositToSpawn: function(creep){
        var spawn = creep.pos.findClosestByRange(Game.spawns);
        if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(spawn);    
        }
    },
    peek: function(array){
        var x = array.pop();
        array.push(x);
        return x;
    },
    /*
     * Assembler for creep bodies used by the Produce module
     * @param {String} role - Role of the creep to be built
     * @param {Integer} extensions - Number of extensions availbile to the spawn
     */
    assembleCreep: function(role, extensions){
        var objUnit = require("unit_" + role);
        var arrParts = objUnit.partWeightsExt(extensions); //Note: This is pulling a 2D array of parts and how many of that part of the base version
        var creepBody = [];
		var length = arrParts.length
        for(var i = 0; i<length;i++){
			var partData = arrParts.pop();
            var partType = partData[0]
			var partCount = partData[1]
			for(var j = 0; j < partCount;j++){
				creepBody.unshift(partType);
			}
        }
        console.log(creepBody)
        return creepBody;
    },
    roomExtCount: function(roomObject){
        var extensions = roomObject.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }});
        return extensions.length;
    },
    findLowExtensions: function(roomObject){
        var roomstructures = roomObject.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }});
        for(i in roomstructures){
            if(i.energy < i.energyCapacity){return i}
        }
        return -1;
    },
    returnEnergyToBase: function(creep, includecreeps){
        if(includecreeps == null || includecreeps == undefined){
            includecreeps = false;
        }
        if(creep.memory.returnTo != null){
            if(Game.getObjectById(creep.memory.returnTo).structureType == "storage"){delete creep.memory.returnTo; return;}
        	var home = Game.getObjectById(creep.memory.returnTo);
        	if(home == null){
        	    delete creep.memory.returnTo;
        	}
        	var result = creep.transfer(home, RESOURCE_ENERGY) 
        	if(result == ERR_NOT_IN_RANGE) {
        		creep.moveTo(home);
        	}
        	if(result == ERR_FULL){
        		delete creep.memory.returnTo;
        	}
        	if(home instanceof Creep){
        	    home = null;
        	}
        }
        if(creep.memory.returnTo == null){              //RETURN LOGIC
        	var home = null
        	if(!home){
        		var towerHome = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        			filter: function(s){
        				return ((s.energy < s.energyCapacity) && 
        				        (s.structureType == "tower"))
        			}
        		})
        		if(towerHome){
        			home = towerHome
        		}
        	}
        	if(!home){
        		var spawnHome = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {
        			filter: function(spawner){
        				return spawner.energy < spawner.energyCapacity;
        			}
        		})
        		if(spawnHome){
        			home = spawnHome
        		}
        	}
        	if(!home){
        		
        		var extHome = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        			filter: function(structure){
        				return (structure.structureType == STRUCTURE_EXTENSION &&
        					structure.energy < structure.energyCapacity);
        			}
        		})
        		if(extHome){
        			home = extHome
        		}
        	}
        	if(!home){
        		var storageHome = creep.room.find(FIND_MY_STRUCTURES, {
        			filter: function(s){
        			    return (s.structureType == "storage" || s.totalEnergy() < s.storeCapacity)
        			}
        		})
        		if(storageHome != null){
        			home = storageHome[0]
        		}
        	}
        	if(!home && includecreeps){
        		if(creep.memory.repeated){
        			creep.memory.repeated ++
        		}else{
        			creep.memory.repeated = 1;
        		}
        		if(creep.memory.repeated > 1){
        			//this.rerollJob()   << HERE IS WHAT TO DO IF YOU GET STUCK 
        			var c = creep.room.find(FIND_MY_CREEPS)  
        			creep.memory.toSay = creep.memory.toSay + "OL2 SCV"
        			var creepHome = c.filter(creep => creep.memory.role == 'scv' && _.sum(creep.carry) < creep.carryCapacity*.25)
        			if(creepHome[0])
        			creep.memory.returnTo = creepHome[0].id;
        		    delete creep.memory.repeated
        		}
        	}
        	if(!home && !includecreeps){
        	    return "ERR_NO_TARGET"
        	}	
        	if(home != null){
        	    creep.memory.returnTo = home.id;
        	    creep.moveTo(home)
        	    creep.transfer(home, RESOURCE_ENERGY)
        	}
        	return
        }
    },
    //Following Code Given by harrier
    creepCost: function(parts){
        var cost = _.sum(parts,p=>BODYPART_COST[p]);
        return cost;
    },
    smartChooseSource: function(creep){
        var sources = creep.room.find(FIND_SOURCES);
        var target = null;
        if(!target){
            for(var i = 0; i<sources.length; i++){
                if(sources[i].pos.findInRange(FIND_MY_CREEPS, 2).length < 2 && !sources[i].pos.findInRange(FIND_HOSTILE_CREEPS, 4)){
                    target = sources[i];
                    return target;
                }
                
            }
        }else{
            //BACKUP?
        }
    },
    mineSource: function(target){
        creep.moveTo(target);
        creep.harvest(target);
    },
    findEnergy: function(creep){
        var targets = creep.room.find(FIND_STRUCTURES, {
        			filter: function(s){
        			    let total = _.sum(s.store);
        				return (total > 0 &&
        				s.structureType != STRUCTURE_EXTENSION &&
        				s.structureType != STRUCTURE_SPAWN)
        			}})
        var source = _.sortBy(targets, function(t){ return _.sum(t.store);})
        if(source.length > 0){
            return source[0].id;
        }
        return null;
    },
    findEnergy2: function(creep){
        var s = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        			filter: function(s){
        			    var total = _.sum(s.store);
        				return (total > 0 &&
        				s.structureType != STRUCTURE_EXTENSION &&
        				s.structureType != STRUCTURE_SPAWN)
        			}})
        console.log(s.length)
        return s.id;
    },
    pullFromSource: function(sourceId, creep){
        if(creep == null){
            var creep = this.creep;
        }
        var target = Game.getObjectById(sourceId)
        console.log(target + sourceId)
        var cans = target.pos.findInRange(FIND_STRUCTURES, 1, {
        			filter: function(structure){
        			    var total = _.sum(structure.store);
        				return (structure.structureType == STRUCTURE_CONTAINER &&
        					total > 0)
        			}})
        if(cans.length > 0){
            return creep.pull(cans[0])   
        }
        var targetcreep = target.pos.findInRange(FIND_MY_CREEPS, 1,{
        			filter: function(c){
        				return (c.memory.role == "miner" &&
        					c.energy > 0);
        			}})
        if(targetcreep.length > 0){
            return creep.pull(targetcreep[0])
        }
        var res = target.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
        if(res != null && res != undefined){
            return creep.pickup(res);
        }
        return "ERR_NO_TARGET"
    }
};