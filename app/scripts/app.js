'use strict';

define(['tube/tube', 'journey-view', 'planner-view', 'jquery'], function (tube, journeyView, plannerView, $) {

	var plannerForm = document.querySelector('.planner-form');
	var routeDisplay = document.querySelector('#route-display');

	var nearestStation;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			nearestStation = tube.nearest(position.coords.latitude, position.coords.longitude);
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
		$(routeDisplay).hide();
		$(plannerForm).show();
		plannerView.focusToPlan();
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

	return {
		init: function () {

			plannerView.init(plannerForm, {
				matcherFunction: stationMatcher(tube.stationNames()),
				submitHandler: viewJourney
			});

			plannerView.setFrom(nearestStation);

			journeyView.init(routeDisplay, cancelRouteView);

		}
	};
});
