'use strict';
(function(){

	var tube = require('./tube/tube.js');
	var journeyView = require('./journey-view.js');
	var plannerView = require('./planner-view.js');

	var plannerForm = document.querySelector('.planner-form');
	var routeDisplay = document.querySelector('#route-display');

	var nearestStation = '...';

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			nearestStation = tube.nearest(position.coords.latitude, position.coords.longitude);
			plannerView.setFrom(nearestStation);
		});
	}

	var stationMatcher = function(stationNames){
		return function findMatches(query, callback){
			var matches = stationNames.filter(function(item){
				return item.value.toLowerCase().indexOf(query.toLowerCase()) === 0;
			});
			callback(matches);
		};
	};

	function cancelRouteView(){
		routeDisplay.style.display = 'none';
		plannerForm.style.display = 'block';
		plannerView.focusToPlan();
		return false;
	}

	function viewJourney(from, to) {
		try{
			if(from !== '' && to !== ''){
				var route = tube.route(from, to);
				if (route.success === true) {
					plannerForm.style.display = 'none';
					routeDisplay.style.display = 'block';

					journeyView.showRoute(route.path);

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

	module.exports = {
		init: function () {

			plannerView.init(plannerForm, {
				matcherFunction: stationMatcher(tube.stationNames()),
				submitHandler: viewJourney
			});

			journeyView.init(routeDisplay, cancelRouteView);

		}
	};

})();
