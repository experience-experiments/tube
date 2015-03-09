'use strict';

define(['tube', 'vis'], function (tube, vis) {

	var sheet = document.querySelector('#sheet');
	var fromEl = document.querySelector('#startStation');
	var toEl = document.querySelector('#destStation');
	var submitEl = document.querySelector('#showRoute');

	function getRoute(from, to) {
		var r = tube.route(from, to);
		if (r.success === true) {
			vis.showRoute(r.path);
		} else {
			sheet.innerHTML = r.message;
		}
		return false;
	}

	return {
		init: function () {

			fromEl.value = 'Liverpool Street';

			toEl.value = 'Camden Town';
			toEl.focus();

			submitEl.onclick = function () {
				return getRoute(fromEl.value, toEl.value);
			};



			vis.init(sheet);

		}
	};
});
