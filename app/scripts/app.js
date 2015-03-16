'use strict';

define(['tube', 'vis','jquery','addtohomescreen','typeahead'], function (tube, vis, $) {

	var plannerForm = document.querySelector('.planner-form');
	var routeDisplay = document.querySelector('#route-display');
	var fromEl = document.querySelector('#from-station');
	var toEl = document.querySelector('#to-station');

	var changeFromBtn = document.querySelector('#change-from');
	var goBtn = document.querySelector('#go');


	var stationMatcher = function(stationNames){
		return function findMatches(query, callback){
			var matches = stationNames.filter(function(item){
				return item.value.toLowerCase().indexOf(query.toLowerCase()) === 0;
			});
			callback(matches);
		};
	};

	function getRoute(from, to) {
		try{
			var route = tube.route(from, to);
			if (route.success === true) {
				$(plannerForm).hide();
				$(routeDisplay).show();

				vis.showRoute(route.path);
				document.querySelector('.cancel-link').onclick = function () {
					$(routeDisplay).hide();
					$(plannerForm).show();
					toEl.value = '';
					toEl.focus();
					return false;
				};
				return false;
			} else {
				$(routeDisplay).show();
				console.log(route.message);
				return false;
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

	function showJourney(e){
		setTimeout(function(){getRoute(fromEl.value, toEl.value);}, 500);
	}

	return {
		init: function () {

			vis.init(routeDisplay);

			var stationNames = tube.stationNames();

			$('.typeahead').typeahead({
				hint: true,
				minLength: 2,
				highlight: true
			},{name: 'stations', displayKey:'value', source:stationMatcher(stationNames)});

			toEl.focus();

			goBtn.onclick = showJourney;

			$(toEl).on('typeahead:selected', showJourney);
			$(toEl).on('typeahead:autocompleted', showJourney);

			changeFromBtn.onclick = function () {
				fromEl.focus();
				return false;
			};

			window.addToHomescreen();

			setFromLocation();


		}
	};
});
