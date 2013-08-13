define([

	'app',
	'lodash',
	'bbloader'

], function (
	app,
	_,
	Backbone

) {

	var QuestionView = Backbone.Marionette.ItemView.extend({

		tagName:  'tr',
		template: '#template-question'

	});

	return QuestionView;

});
