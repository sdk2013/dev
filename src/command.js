/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('command');
 * mod.thing == 'a thing'; // true
 */
/*
MODULE TYPE: Unit Command 
This module grabs the role for each unit from memory, loads, and runs it


*/
module.exports = function(creeps){
    var roleManager = require('roleManager')
    for(var name in creeps){
        var creep = creeps[name]
        if(creep.spawning || creep.memory.role == undefined)
			continue;
			
		var strRole = creep.memory.role;
		if(roleManager.roleExists(strRole)){
		    var objRole = roleManager.getRole(strRole);
		}else{
		    continue;
		}
		if(objRole != undefined){
		    var role = Object.create(objRole);    
		}else{
		    console.log("Attempted to run UNDEFINED of following:   " + strRole)
		    continue;
		}
		role.setCreep(creep);
		try { role.run(); } catch(e) { 
		    console.log(creep.name + "  Stack: " + e.stack)
		};
    }
    
};