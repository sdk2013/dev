/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_manager');
 * mod.thing == 'a thing'; // true
 */
/*
MODULE TYPE: Parse

This module throws together a working object comprised of the prototype, subtype, and utilities modules

*/
module.exports = {
	roleExists: function(role){
		try
		{
			require("unit_" + role);
			return true;
		}
		catch(e)
		{
			return false;
		}
	},
	getRole: function(role)
	{
		if(!this.roleExists(role))
			return false;

        var unit_prototype = require('unit_prototype');
		var objUnit = require("unit_" + role);
        objUnit = require('extend')(objUnit, unit_prototype);
		return objUnit;
	}
};