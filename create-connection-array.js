var fs = require('fs');
var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname + '/app/scripts',
	nodeRequire: require
});


var allStations = requirejs('tube/stations');

var lineStations = fs.readFileSync(process.argv[2]).toString().split('\n');

var lineConnections = [];

for(var i in lineStations){
	lineConnections.push(allStations.filter(function(item){
		return item[1].toLowerCase() === lineStations[i].toLowerCase();
	}).map(function(item){
		return item[0];
	})[0]);
}

console.log(lineConnections);
