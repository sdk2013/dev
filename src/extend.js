/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extend');
 * mod.thing == 'a thing'; // true
 */
//blatantly stolen from https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
module.exports = function (destination, source) {
	for (var k in source) {
		if (!destination.hasOwnProperty(k)) {
			destination[k] = source[k];
		}
	}
	return destination;
};