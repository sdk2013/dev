/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure_tower');
 * mod.thing == 'a thing'; // true
 */
var tower = {
    run: function(){
        var tower = this
        var targets = tower.room.find(FIND_HOSTILE_CREEPS)
        if(targets.length > 0){
            tower.attack(targets[0])
            return;
        }
        targets = tower.room.find(FIND_MY_CREEPS, {
            filter: function(c){
                return c.hits < c.hitsMax
            }})
        if(targets.length > 0){
            tower.heal(targets[0])
        }
    }
}
module.exports = tower;