'use strict';

define(['network', 'stations', 'connections'], function (Network, stations, connections) {

	// create a Network using the London Underground's stations and connections
	var network = new Network(stations, connections);

	var notability = {
		last: 4,
		first: 3,
		changeLine: 2,
		changeDirection: 1,
		none: 0
	};

	// is there anything interesting about the given station for this route?
	function stationNotability(station, index, route) {
		if (index === 0) {
			return notability.first;
		}
		var prev = route[index - 1];
		if (prev.connection.line !== station.connection.line) {
			return notability.changeLine;
		}
		if (prev.connection.direction !== station.connection.direction) {
			return notability.changeDirection;
		}
		return notability.none;
	}

	return {
		stationNames: function () {
			var names = network.connectedStations.map(function (station) {
				return {value:station.name};
			});
			return names;
		},

		route: function (from, to) {
			var r = network.route(from, to);
//      debug(r.path);
			return r;
		},

		network: function () {
			return network;
		},

		nearest: function (lat, long){
			var nearestIndex = stations.reduce(function(value, currentStation, index){
				var x = Math.abs( currentStation[2] - lat );
				var y = Math.abs( currentStation[3] - long );
				var z = Math.sqrt( x * x + y * y);
				if(z <= value.dist){
					return {dist: z, index: index}
				} else {
					return value;
				}
			},{dist:1000, index: -1});
			return stations[nearestIndex.index][1];
		},

		// return a description that should be displayed
		// alongside the i'th station on the route
		routeDescription: function (i, route) {
			var station = route[i];

			switch (stationNotability(station, i, route)) {

				case notability.first:
					return station.connection.line + " line";

				case notability.changeLine:
					return station.connection.line + " line " + station.connection.direction;

				case notability.changeDirection:
					return "Change to " + station.connection.direction;

				default:
					return "";
			}
		}
	};
});
