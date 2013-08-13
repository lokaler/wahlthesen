require([

	'app',

	'models/Question',
	'models/Answer',
	'collections/Questions',
	'collections/Answers',

	'views/QuestionsView'

], function(

	App,

	Question,
	Answer,
	Questions,
	Answers,

	QuestionsView

) {

	function do_analysis() {
		if (App.data.questions) {
			console.log('START ANALYSIS');
			// App.data.questions.each(function(q, i) {
			// 	console.log(q);
			// });
		}
	}

	function answer_select(view, value) {
		App.data.user_answers.at(view.model.id).set('value', value);
	}

	function answer_weight_toggle(view, value) {
		App.data.user_answers.at(view.model.id).set('double_weight', value);
	}

	App.start();

	// init app data
	App.data = {};
	App.data.questions = new Questions();
	App.data.questions.fetch({ reset: true });
	App.listenToOnce(App.data.questions, 'reset', function() {
		App.data.user_answers = new Answers();
		App.data.questions.each(function(q) {
			App.data.user_answers.add(new Answer(q.id));
		});
	});

	// question table
	var question_table = new QuestionsView({ collection: App.data.questions });
	App.layout.region_table.show(question_table);
	App.listenTo(question_table, 'start', do_analysis);
	App.listenTo(question_table, 'itemview:answer-select', answer_select);
	App.listenTo(question_table, 'itemview:answer-weight-toggle', answer_weight_toggle);

});
