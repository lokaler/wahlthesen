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
		itemViewContainer: '#questions-table-rows',
		template:          _.template(template_questions_table),

		triggers: {
			'click button[name=start]': 'start'
		},

		events: {
			'itemview:answer-select': 'scrollToNextAnswer'
		},

		scrollToNextAnswer: function(view, answer_idx, target) {
			var $next_row = this.$(target).parent().parent().next();
			if ($next_row.length == 0)
				return;
			var $scroller = this.$('#questions-table-rows-wrapper');
			var next_row_bottom_pos = $next_row.position().top + $next_row.height() + $scroller.scrollTop();
			var scroll_bottom = $scroller.height() + $scroller.scrollTop();
			if (next_row_bottom_pos > scroll_bottom) {
				$scroller.clearQueue()
					.animate({ scrollTop: next_row_bottom_pos - $scroller.height() }, 200);
			}
		},

		onRender: function() {
			this.on('itemview:answer-select', this.scrollToNextAnswer);
		},

		showAverages: function() {
			this.children.each(function(v) { v.showAllAverages(); });
		}

	});

	return QuestionsView;

});
