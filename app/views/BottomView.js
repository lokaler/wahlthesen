define([

	'app',
	'lodash',
	'bbloader',
	'text!templates/bottom.html'

], function (

	app,
	_,
	Backbone,
	template_bottom

) {

	var BottomView = Backbone.Marionette.CompositeView.extend({

		template: _.template(template_bottom),

		triggers: {
			'click button[name=start]': 'start'
		}

	});

	return BottomView;

});
