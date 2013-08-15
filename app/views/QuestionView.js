define([

	'app',
	'lodash',
	'bbloader',
	'text!templates/question.html'

], function (

	app,
	_,
	Backbone,
	template_question

) {

	var QuestionView = Backbone.Marionette.ItemView.extend({

		tagName:  'div',
		template: _.template(template_question),
		className: 'row',

		events: {
			'click .radio-button': 'clickRadioButton',
			'click .checkbox':     'clickCheckBox',
		},

		clickRadioButton: function(evt) {
			var $t = this.$(evt.target), $radio_buttons = this.$('.radio-button'),
			  answer_idx = 0;
			// unselect
			if ($t.hasClass('selected')) {
				$t.removeClass('selected');
			}
			// select
			else {
				$radio_buttons.removeClass('selected');
				$t.addClass('selected');
				answer_idx = $radio_buttons.index($t) + 1;
			}
			// trigger select event
			this.trigger('answer-select', answer_idx, evt.target);
		},

		clickCheckBox: function(evt) {
			var $t = this.$(evt.target);
			$t.toggleClass('selected');
			this.trigger('answer-weight-toggle', $t.hasClass('selected'));
		}

	});

	return QuestionView;

});
