define([

	'app',
	'lodash',
	'bbloader',

	'text!templates/result.html'

], function (

	app,
	_,
	Backbone,

	template

) {

	var ResultView = Backbone.Marionette.ItemView.extend({

		template: _.template(template)

	});

	return ResultView;

});
