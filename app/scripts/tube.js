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
		if (index === route.length - 1) {
			return notability.last;
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

		// return a description that should be displayed
		// alongside the i'th station on the route
		routeDescription: function (i, route) {
			var station = route[i];

			switch (stationNotability(station, i, route)) {

				case notability.first:
					return station.connection.line + " line";

				case notability.last:
					return "Reached destination";

				case notability.changeLine:
					return "Change to " + station.connection.line + " line " + station.connection.direction;

				case notability.changeDirection:
					return "Hop on to " + station.connection.direction;

				default:
					return "";
			}
		}
	};
});
