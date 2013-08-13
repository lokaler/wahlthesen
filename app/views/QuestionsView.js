define([

	'app',
	'lodash',
	'bbloader',

	'views/QuestionView'

], function (

	app,
	_,
	Backbone,

	QuestionView

) {

	var QuestionsView = Backbone.Marionette.CompositeView.extend({

		itemViewContainer: '#questions-table-rows tbody',
		template: '#template-questions-table',
		itemView: QuestionView,

		triggers: {
			'click button[name=start]': 'start'
		}

	});

	return QuestionsView;

});
