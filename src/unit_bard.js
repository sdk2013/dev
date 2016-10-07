/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('unit_bard');
 * mod.thing == 'a thing'; // true
 */
var bard = {
    beforeAge: function(){
        var spawner = require('spawner')
        var creep = this.creep;
        spawner.addToQueue("bard", 1, {role:"bard", target: creep.memory.target, part: creep.memory.part}, -1, false);
    },
	
	behavior: function(){
	    var creep = this.creep
	    var target = Game.flags[creep.memory.target].pos
	    var result = creep.moveTo(target);
	    if(creep.room == Game.flags[creep.memory.target].room){
	        
	        if(creep.memory.sync==false){
	            var otherBards = creep.room.find(FIND_MY_CREEPS)
	            if(otherBards.length > 0){
	                creep.memory.line = otherBards[0].memory.line - 1
	            }
                creep.memory.sync = true;	            
	        }
	        if(creep.memory.part == undefined){
	            var otherBards = creep.room.find(FIND_MY_CREEPS)
	            var _ = require("lodash")
        	    var bards = _.remove(otherBards, function(c){
        	        return c.name == creep.name;
        	    })
        	    console.log("bard" + otherBards.length)
	            if(otherBards.length > 0){
            	    var part = otherBards[otherBards.length - 1].memory.part + 1;
	                if(part >3){
	                    part = 1;
	                }
	                creep.memory.part = part;
	            }else{
	                creep.memory.part = 0;
	            }
	        }
	        if(creep.memory.line === undefined){
	            creep.memory.line = 1;
	        }
	        var line = creep.memory.line
	        switch(creep.memory.part){
	            case 1:
	                if(!(43 <= line && line <= 50 ) && !(79 <= line && line <= 100)){
                        creep.say(this.song(creep.memory.line), true)
	                }
	                break;
	            case 2:
	                if(!(29 <= line && line <= 42 ) && !(79 <= line && line <= 100)){
                        creep.say(this.song(creep.memory.line), true)
	                }
	                break;
	            case 3:
	                if(!(29 <= line && line <= 50 )){
                        creep.say(this.song(creep.memory.line), true)
	                }
	                break;
	            default:
	                creep.say(this.song(creep.memory.line), true)
	        }
	        
    	    creep.memory.line++;
    	    if(creep.memory.line == 129){2
    	        creep.memory.line = 1;
    	    }
	    }
	},
	part: function(bards){
	    
	    
	},
	song: function(line){
	    var song = 
	    {   //"1234567890
	        1:"Can you",
	        2:"Hear the",
	        3:"people",
	        4:"sing?",
	        5:"Singing",
	        6:"the song",
	        7:"of angry",
	        8:"men? It is",
	        9:"The music",
	        // "1234567890
	        10:"of a",
	        11:"people who",
	        12:"will not",
	        13:"be slaves",
	        14:"again!",
	        15:"When the",
	        16:"beating",
	        17:"of your",
	        18:"heart",
	        19:"matches",
	        20:"the beat-",
	        21:"ing of the",
	        22:"drums",
	        23:"There is a",
	        24:"life about",
	        25:"to start",
	        26:"when to-",
	        27:"morrow",
	        28:"comes!",
	        
	        //combeferre
	        // "1234567890
	        29:"Will you",
	        30:"Join in",
	        31:"our cru-",
	        32:"sade?!",
	        33:"Who willbe",
	        34:"strong and",
	        35:"stand with",
	        36:"me?",
	        37:"Beyond the",
	        38:"barricade",
	        39:"is there a",
	        40:"world you",
	        41:"long to",
	        42:"see?",
	        
	        //courfeyrac
	        // "1234567890
	        43:"Then join",
	        44:"in the",
	        45:"fight",
	        46:"that will",
	        47:"give you",
	        48:"the right",
	        49:"to be",
	        50:"free!",
	        
	        //Chorus
	        // "1234567890
	        51:"Can you",
	        52:"Hear the",
	        53:"people",
	        54:"sing?",
	        55:"Singing",
	        56:"the song",
	        57:"of angry",
	        58:"men? It is",
	        59:"The music",
	        // "1234567890
	        60:"of a",
	        61:"people who",
	        62:"will not",
	        63:"be slaves",
	        64:"again!",
	        65:"When the",
	        66:"beating",
	        67:"of your",
	        68:"heart",
	        69:"matches",
	        70:"the beat-",
	        71:"ing of the",
	        72:"drums",
	        73:"There is a",
	        74:"life about",
	        75:"to start",
	        76:"when to-",
	        77:"morrow",
	        78:"comes!",
	        
	        //Feuilly
	        // "1234567890
	        79:"Will you",
	        80:"Give all",
	        81:"You can",
	        82:"give, so",
	        83:"that our",
	        84:"banner",
	        85:"may",
	        86:"advance?",
	        87:"Some will",
	        89:"fall and",
	        90:"some will",
	        // "1234567890
	        91:"live. Will",
	        92:"you stand",
	        93:"up and",
	        94:"take your",
	        95:"chance?!",
	        96:"The blood",
	        97:"of martyrs",
	        98:"will water",
	        99:"th meadows",
	        //  "1234567890
	        100:"of france!",
	        
	        //all Chorus
	        101:"Can you",
	        102:"Hear the",
	        103:"people",
	        104:"sing?",
	        105:"Singing",
	        106:"the song",
	        107:"of angry",
	        108:"men? It is",
	        109:"The music",
	        // "1234567890
	        110:"of a",
	        111:"people who",
	        112:"will not",
	        113:"be slaves",
	        114:"again!",
	        115:"When the",
	        116:"beating",
	        117:"of your",
	        118:"heart",
	        119:"matches",
	        120:"the beat-",
	        121:"ing of the",
	        122:"drums",
	        123:"There is a",
	        124:"life about",
	        125:"to start",
	        126:"when to-",
	        127:"morrow",
	        128:"comes!",
	        129:""
	    }
	    return song[line]
	},
	onSpawn: function(){},

	partWeights: function(){
	    return [[MOVE, 1]]
	},
	partWeightsExt: function(e){
	    return [[MOVE, 1]]
	}
}
module.exports = bard;