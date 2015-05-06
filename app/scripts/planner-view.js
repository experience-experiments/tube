'use strict';

define(['jquery', "typeahead.js"], function ($) {

  var plannerForm;
	var fromEl;
	var toEl;
	var viewJourney;
	var matcherFunction;

	function triggerSelection(){
		$(toEl).blur();
	}

	function showJourney(){
		setTimeout(function(){viewJourney(fromEl.value, toEl.value);}, 500);
	}

	function setFromElementValue(value){
		fromEl.value = value;
	}

	function focusToPlan(){
		toEl.value = '';
		toEl.focus();
	}

	return {
		init: function(element, options){
			plannerForm = element;
			toEl = plannerForm.querySelector('#to-station');
			fromEl = plannerForm.querySelector('#from-station');

			viewJourney = options.submitHandler;
			matcherFunction = options.matcherFunction;

			$('.typeahead').typeahead({
				hint: true,
				minLength: 1,
				highlight: true
			},{name: 'stations', displayKey:'value', source: matcherFunction});

			$(toEl).on('blur', showJourney);
			$(toEl).on('typeahead:selected', triggerSelection);
			$(toEl).on('typeahead:autocompleted', triggerSelection);

			$(fromEl).on('focus', function () {
				fromEl.value = '';
			});

			focusToPlan();

		},

		setFrom: setFromElementValue,

		focusToPlan: focusToPlan
	};

});
