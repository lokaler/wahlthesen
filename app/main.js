require([

	'app',

	'models/Question',
	'collections/Questions',
	'views/QuestionsView'

], function(

	App,

	Question,
	Questions,
	QuestionsView

) {
	
	App.start();

	var questions = new Questions();
	questions.fetch();
	q = questions;
	var question_table = new QuestionsView({
		collection: questions
	});
	App.layout.region_table.show(question_table);

});
