'use strict';

define(['tube/tube', 'journey-view','jquery','typeahead'], function (tube, journeyView, $) {

	var plannerForm = document.querySelector('.planner-form');
	var routeDisplay = document.querySelector('#route-display');
	var fromEl = document.querySelector('#from-station');
	var toEl = document.querySelector('#to-station');

	var stationMatcher = function(stationNames){
		return function findMatches(query, callback){
			var matches = stationNames.filter(function(item){
				return item.value.toLowerCase().indexOf(query.toLowerCase()) === 0;
			});
			callback(matches);
		};
	};

	function viewPlannerForm(){
		$(routeDisplay).hide();
		$(plannerForm).show();
		toEl.value = '';
		toEl.focus();
		return false;
	}

	function viewJourney(from, to) {
		try{
			if(from !== '' && to !== ''){
				var route = tube.route(from, to);
				if (route.success === true) {
					$(plannerForm).hide();
					$(routeDisplay).show();

					journeyView.showRoute(route.path);

					document.querySelector('.cancel-link').onclick = viewPlannerForm;
				} else {
					console.log(route.message);
				}
			}
		} catch(e){
			console.log(e);
		}finally {
			return false;
		}

	}

	function setFromLocation(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				var nearest = tube.nearest(position.coords.latitude, position.coords.longitude);
				fromEl.value = nearest;
			});
		}
	}

	function showJourney(){
		setTimeout(function(){viewJourney(fromEl.value, toEl.value);}, 500);
	}

	function triggerSelection(){
		$(toEl).blur();
	}

	return {
		init: function () {

			setFromLocation();

			journeyView.init(routeDisplay);

			var stationNames = tube.stationNames();

			$('.typeahead').typeahead({
				hint: true,
				minLength: 1,
				highlight: true
			},{name: 'stations', displayKey:'value', source:stationMatcher(stationNames)});

			toEl.focus();

			$(toEl).on('blur', showJourney);
			$(toEl).on('typeahead:selected', triggerSelection);
			$(toEl).on('typeahead:autocompleted', triggerSelection);


			$(fromEl).on('focus', function () {
				fromEl.value = '';
			});

		}
	};
});
