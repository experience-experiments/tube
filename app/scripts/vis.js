'use strict';

define(['d3', 'tube'], function (d3, tube) {

	var parentEl;
	var vis;

	// the height of each station list element
	var stationGap = 50;

	var connectionBarWidth = 5;
	var longestRouteLength = 0;


	function resizeSVG(route) {
		var height = (stationGap * route.length) + 20;
		var svg = document.querySelector("svg");

		parentEl.style.height = height + 'px';

		svg.style.height = height + 'px';
		svg.style.width = '600px';
	}


	function showWithSVG(route) {
		// resize svg element to fit entire route

		if (route.length > longestRouteLength) {
			longestRouteLength = route.length;
			resizeSVG(route);
		}

		// data join
		var nodes = vis.selectAll(".station").data(route);

		// enter
		var station = nodes.enter()
			.append("g")
			.attr("class", "station")
			.attr("transform", function (d, i) {
				var height = (i * stationGap) + 20;
				return "translate(" + 30 + "," + height + ")";
			});

		station.append("rect")
			.attr("class", "station-connection");
		station.append("circle")
			.attr("class", "station-stop")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0.1)
			.attr("fill", "white")
			.attr("stroke-width", 5);
		station.append("text")
			.attr("class", "station-name")
			.attr("dy", "0.4em")
			.attr("dx", "3em");
		station.append("text")
			.attr("class", "station-description-label")
			.attr("dy", "1.6em")
			.attr("dx", "3em");

		// exit
		nodes.exit()
			.transition()
			.duration(900)
			.style("fill-opacity", 1e-6)
			.remove();

		vis.selectAll(".station-connection")
			.data(route)
			.attr("fill", function (s, i) {
				if (i < route.length - 1) {
					return s.lineData.colour;
				} else {
					return "orange";
				}
			})
			.attr("width", connectionBarWidth)
			.attr("height", function (s, i) {
				return (i === route.length - 1) ? 0 : stationGap;
			})
			.attr("x", -connectionBarWidth / 2);

		vis.selectAll(".station-stop")
			.data(route)
			.attr("stroke", function (s) {
				return s.lineData.colour;
			})
			.attr("r", 10);

		vis.selectAll(".station-name")
			.data(route)
			.text(function (s) {
				return s.name;
			});

		vis.selectAll(".station-description-label")
			.data(route)
			.text(function (s, i) {
				return tube.routeDescription(i, route);
			});
	}

	return {
		init: function (parent) {
			parentEl = parent;
			parentEl.innerHTML = '';
			vis = d3.select(parentEl).append("svg").append("g");
		},

		showRoute: showWithSVG
	};
});
