require([

	'app',

	'modules/devtools/Module',

	'models/Question',
	'models/Answer',
	'models/QuestionsFilter',
	'models/Abgeordnete',

	'collections/Questions',
	'collections/Answers',

	'views/QuestionsView',
	'views/QuestionsFilterView',
	'views/BottomView'

], function(

	App,

	DevtoolsModule,

	Question,
	Answer,
	QuestionsFilter,
	Abgeordnete,

	Questions,
	Answers,

	QuestionsView,
	QuestionsFilterView,
	BottomView

) {

	App.modules = {};

	function do_analysis() {
		if (App.data.questions) {
			var questions_filter = new QuestionsFilterView({
				model: App.data.questions_filter
			});
			App.layout.region_filter.show(questions_filter);
			App.listenTo(questions_filter, 'filter-toggle', function(model, field, value) {
				model.set(field, value);
			});
		}
	}

	function answer_select(view, value) {
		App.data.user_answers.at(view.model.id).set('value', value);
	}

	function answer_weight_toggle(view, value) {
		App.data.user_answers.at(view.model.id).set('double_weight', value);
	}

	App.addInitializer(function() {
		App.modules.devtools = new DevtoolsModule();
	});
		
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
	App.data.questions_filter = new QuestionsFilter();
	App.data.abgeordnete = new Abgeordnete();
	App.data.abgeordnete.load();

	// question table
	var questions_table = new QuestionsView({ collection: App.data.questions });
	App.layout.region_table.show(questions_table);
	App.listenTo(questions_table, 'itemview:answer-select', answer_select);
	App.listenTo(questions_table, 'itemview:answer-weight-toggle', answer_weight_toggle);

	// bottom
	var bottom_view = new BottomView();
	App.layout.region_bottom.show(bottom_view);
	App.listenToOnce(bottom_view, 'start', function() {
		App.layout.region_bottom.close();
		do_analysis();
	});

});
