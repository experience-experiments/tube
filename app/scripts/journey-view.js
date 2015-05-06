'use strict';
(function(){
	var d3 = require('d3');
	var tube = require('./tube/tube.js');

	var parentEl;
	var svgView;
	var cancelHandler;

	// the height of each station list element
	var stationGap = 50;

	var connectionBarWidth = 5;

	var stationTypes = {
		start:1,
		middle:2,
		change:3,
		finish:4
	};

	function stationType(route, i){
		if (i === 0) {
			return stationTypes.start;
		}
		if (i === (route.length - 1)){
			return stationTypes.finish;
		}
		var prev = route[i - 1];
		var current = route[i];
		if (prev.connection.line !== current.connection.line || prev.connection.direction !== current.connection.direction) {
			return stationTypes.change;
		}
		return stationTypes.middle;
	}

	function showWithSVG(route) {

		d3.select(parentEl).select("svg").remove();

		var height = (stationGap * route.length) + 20;
		svgView = d3.select(parentEl).append("svg").style("height", height + 'px');

		// data join
		var nodes = svgView.selectAll(".station").data(route);

		// enter
		var station = nodes.enter()
			.append("g")
			.attr("class", "station")
			.attr("transform", function (d, i) {
				return "translate(" + 30 + "," + ((i * stationGap) + 20) + ")";
			});

		station.append("rect")
			.attr("class", "station-connection");
		station.append("circle")
			.attr("class", "station-stop")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0.1);
		station.append("text")
			.attr("class", "station-name")
			.attr("dy", "0.4em")
			.attr("dx", "3em");
		station.append("text")
			.attr("class", "station-description-label")
			.attr("dy", "1.7em")
			.attr("dx", "3em");
		station.filter(function(d, i) {
				return stationType(route, i) === stationTypes.change;
			})
			.append('text')
			.text("✰").
			attr("dx","22").attr("dy","5").attr("class","change-icon");
		station.filter(function(d, i) {
				return stationType(route, i) === stationTypes.finish;
			})
			.append('a').attr("class","cancel-link")
			.on('click', cancelHandler)
			.append('text').text("⊗").attr("dx","200").attr("dy","10");



		svgView.selectAll(".station")
			.data(route)
			.attr("data-type", function(s,i){
				switch(stationType(route, i)){
					case stationTypes.start:
						return 'start';
					case stationTypes.finish:
						return 'finish';
					case stationTypes.change:
						return 'change';
					default:
						return 'middle';
				}
			});

		svgView.selectAll(".station-connection")
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

		svgView.selectAll(".station-stop")
			.data(route)
			.attr("r", function(s, i){
				switch(stationType(route, i)){
					case stationTypes.start:
					case stationTypes.finish:
						return 15;
					case stationTypes.change:
						return 13;
					default:
						return 10;
				}
			});

		svgView.selectAll(".station-name")
			.data(route)
			.text(function (s) {
				return s.name;
			});

		svgView.selectAll(".station-description-label")
			.data(route)
			.text(function (s, i) {
				return tube.routeDescription(i, route);
			});

		var dy = svgView.select('.station[data-type="finish"] .station-name').node().getBBox().width + 60;
		svgView.selectAll('.station[data-type="finish"] a text').attr("dx",dy);


	}

	module.exports = {
		init: function (parent, cancelFunction) {
			parentEl = parent;
			parentEl.innerHTML = '';
			cancelHandler = cancelFunction;
			svgView = d3.select(parentEl).append("svg");
		},

		showRoute: showWithSVG
	};
})();
