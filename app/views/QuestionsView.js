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
		itemView: QuestionView

	});

	return QuestionsView;

});
