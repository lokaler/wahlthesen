define([

	'bbloader',

	'text!./template-comments.html',
	'text!./template-circles.html'

], function (
	
	Backbone,
	template,
	template_circles
) {

template_circles = _.template(template_circles);

var CommentsView = Backbone.Marionette.CompositeView.extend({

	name: 'CommentsView',
	template: _.template(template),
	
	initialize: function() {
		App.model.on('change:selected_party', function(model) {
			var party = model.changed.selected_party;
			if (party == null)
				this.model.set('_show_comments', false);
			else
				this.render();
		}, this);
	},

	serializeData: function() {
		var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments);

		var question_id = this.model.get('id');
		var party       = App.model.get('selected_party');

		var answers =
			_.chain(App.data.abgeordnete.get('opinions'))
			.filter(function(opinion) { return opinion.party == party; })
			.map(function(opinion) {
				return _.extend(
					opinion.answers.at(question_id).attributes,
					{
						bundesland: opinion.bundesland,
						gender: opinion.gender,
						year: opinion.year
					}
				)
			})
			.value();
		
		var answers_note = 
			_.chain(answers)
			.filter(function(answer) {  return !!answer.note; })
			.map(function(answer) {
				answer.answer_1 = answer.value == -2;
				answer.answer_2 = answer.value == -1;
				answer.answer_3 = answer.value ==  0;
				answer.answer_4 = answer.value ==  1;
				answer.answer_5 = answer.value ==  2;
	
				answer.gender_w = answer.gender == "w";
				answer.gender_m = answer.gender == "m";
	
				if (answer.bundesland == 'Saarland') answer.bundesland = 'dem Saarland';
	
				return answer;
			})
			.sortBy(function(answer) {  return answer.value; })
			.value();

		function num_answers(v) {
			return _.filter(answers, function(answer) { return answer.value == v; }).length;
		}

		data.num_answers = [
			null,
			num_answers(-2),
			num_answers(-1),
			num_answers(0),
			num_answers(1),
			num_answers(2)
		];
		data.num_answers.total = answers.length;

		data.answers_note = answers_note;
		data.party = party;
		
		// partials
		data.render_circles = template_circles;

		// functions
		data.num_answers_percent = function(answer_value) {
			return Math.round(data.num_answers[answer_value] / data.num_answers.total * 100);
		}

		data.num_answers_text = function(answer_value) {
			var num_abgeordnete = data.num_answers[answer_value];
			var text_abgeordnete;
			if      (num_abgeordnete == 0) text_abgeordnete = 'Kein Abgeordneter';
			else if (num_abgeordnete == 1) text_abgeordnete = '1 Abgeordneter';
			else                           text_abgeordnete = '%s Abgeordnete'.format(num_abgeordnete);
			
			if (num_abgeordnete == 0)
				return text_abgeordnete;
			else
				return '%s (%s%%)'.format(text_abgeordnete, data.num_answers_percent(answer_value));
		}

		return data;
	}
});

return CommentsView;


});
