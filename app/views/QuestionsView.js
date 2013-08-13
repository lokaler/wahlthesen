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

		itemViewContainer: 'tbody',
		template: '#template-question-table',
		itemView: QuestionView,

		triggers: {
			'click button[name=start]': 'start'
		}

	});

	return QuestionsView;

});
