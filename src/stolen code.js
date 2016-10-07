/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('STOLEN CODE');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    var repairTargets = creep.room.find(FIND_STRUCTURES, {

    filter: object => (

      ( ( object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_RAMPART ) && object.hits < ( object.hitsMax * 0.8 ) ) ||

      ( ( object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART ) && object.hits < Memory.rooms[roomName].max_walls && object.hitsMax != 0)

    )

});

creep.say(`${repairTargets.length} tgts`);

if (repairTargets.length > 0) {

    let repairTarget = creep.pos.findClosestByRange(repairTargets);

    dest = repairTarget.id;

    creep.memory.job = 'repair';

}
};

//888888***************************************
var repairObject = _(creep.room.find(FIND_STRUCTURES))
.filter( s=> (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits <= average);
.sortBy( s=> s.hits)
.first()


// SPARR's TARGET AI FOR TOWERS - DOES NOT ACTUALLY WORK
// EDIT Works now. changed [0] to .first();
      let target = _(tower.room.find(FIND_HOSTILE_CREEPS)).sortBy(c=>
        -(
          c.getActiveBodyparts(HEAL)*20 +
          c.getActiveBodyparts(ATTACK)*10 +
          c.getActiveBodyparts(RANGED_ATTACK)*5 +
          c.getActiveBodyparts(WORK)
        )
      ).first();;
      
//Heilos' find closest unused source code
        _(creep.room.find(FIND_SOURCES))
        .filter(s => s.pos.findInRange(FIND_MY_CREEPS, 1).length ==0)
        .sortBy(s => -this.pos.getRangeTo(s.pos) )
        .value()