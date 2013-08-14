define([

	'app',
	'lodash',
	'bbloader',

	'views/QuestionView',
	'text!templates/questions-table.html'

], function (

	app,
	_,
	Backbone,

	QuestionView,
	template_questions_table

) {

	var QuestionsView = Backbone.Marionette.CompositeView.extend({

		itemView:          QuestionView,
		itemViewContainer: '#questions-table-rows tbody',
		template:          _.template(template_questions_table),

		triggers: {
			'click button[name=start]': 'start'
		},

		events: {
			'itemview:answer-select': 'scrollToNextAnswer'
		},

		scrollToNextAnswer: function(view, answer_idx, target) {
			var $selected_tr = this.$(target).parent().parent(),
			$scroller = this.$('#questions-table-rows-wrapper'),
			scroll_top = $scroller.scrollTop(),
			scroll_top_needed = Math.max(0, $selected_tr.position().top + $selected_tr.height() - $scroller.height() + scroll_top);
			if (scroll_top_needed > scroll_top)
				$scroller.animate({ scrollTop: scroll_top_needed }, 200);
		},

		onRender: function() {
			this.on('itemview:answer-select', this.scrollToNextAnswer);
		}

	});

	return QuestionsView;

});
