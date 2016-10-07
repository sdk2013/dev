/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('defend');
 * mod.thing == 'a thing'; // true
 */

module.exports = function(structures){
    for(var id in structures){
        var s = Game.getObjectById(id)
        if(s instanceof StructureTower){
            try{
                var tower = require("structure_tower")
                tower.run.call(s);
            }catch(e){
                console.log("Tower Error: " + e.stack)
            }
        }
    }
};