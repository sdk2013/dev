/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('stat_wrapper');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(f){
    var before = Game.cpu.getUsed;
    f();
    var after = Game.cpu.getUsed;
    var used = (after-before)
    if(Memory.stats.commandCPU == null){Memory.stats.commandCPU = {}};
    
    Memory.stats.commandCPU["Bacon"] = used;
};