'use strict';

define(['tube', 'vis','jquery','typeahead'], function (tube, vis, $) {

	var plannerForm = document.querySelector('.planner-form');
	var routeDisplay = document.querySelector('#route-display');
	var fromEl = document.querySelector('#from-station');
	var toEl = document.querySelector('#to-station');

	var changeFromBtn = document.querySelector('#change-from');
	var goBtn = document.querySelector('#go');
	var changeJourneyBtn = document.querySelector('#change-journey');

	var stationMatcher = function(stationNames){
		return function findMatches(query, callback){
			var matches = stationNames.filter(function(item){
				return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
			});
			callback(matches);
		};
	};

	function getRoute(from, to) {
		var route = tube.route(from, to);
		if (route.success === true) {
			$(plannerForm).hide();
			$(routeDisplay).show();
			$(changeJourneyBtn).show();
			vis.showRoute(route.path);
		} else {
			$(routeDisplay).show();
			routeDisplay.innerHTML = route.message;
		}
		return false;
	}

	return {
		init: function () {

			$(changeJourneyBtn).hide();

			fromEl.value = 'Liverpool Street';

			toEl.focus();

			vis.init(routeDisplay);

			var stationNames = tube.stationNames();

			$(toEl).typeahead({
				hint: true,
				minLength: 2,
				highlight: true
			},{name: 'stations', displayKey:'value', source:stationMatcher(stationNames)});


			goBtn.onclick = function () {
				return getRoute(fromEl.value, toEl.value);
			};

			changeFromBtn.onclick = function () {
				fromEl.value = '';
				fromEl.focus();
				return false;
			};

			changeJourneyBtn.onclick = function () {
				$(routeDisplay).hide();
				$(changeJourneyBtn).hide();
				$(plannerForm).show();
				toEl.value = '';
				toEl.focus();
				return false;
			};
		}
	};
});
