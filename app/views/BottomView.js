define([

	'app',
	'lodash',
	'bbloader'

], function (

	app,
	_,
	Backbone

) {

	var BottomView = Backbone.Marionette.CompositeView.extend({

		template: '#template-bottom',

		triggers: {
			'click button[name=start]': 'start'
		}

	});

	return BottomView;

});
