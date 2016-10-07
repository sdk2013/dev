/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('unit_prototype');
 * mod.thing == 'a thing'; // true
 */
var unitPrototype = {
    setCreep: function(creep){
        this.creep = creep
        return this
    },
    run: function(){
        this.creep.memory.toSay = ""
		this.behavior(this.creep);
		if(this.creep.ticksToLive == 1){
		    this.beforeAge();
		}
		if(this.creep.memory.toSay != null && this.creep.memory.toSay != undefined && !(this.creep.memory.toSay=="")){
		    this.creep.say(this.creep.memory.toSay);
		}
	},
	
	beforeAge: function(){},
	
	behavior: function(){},
	
	onSpawn: function(){},

	partWeights: function(){},
	
	partWeightsExt: function(e){}
}
module.exports = unitPrototype