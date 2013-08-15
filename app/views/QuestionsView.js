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
			var $scroller = this.$('#questions-table-rows-wrapper');
			var $next_tr = this.$(target).parent().parent().next();
			var next_tr_bottom_pos = ($next_tr.position().top - $scroller.position().top)
				+ $next_tr.height() + $scroller.scrollTop();
			var scroll_bottom = $scroller.height() + $scroller.scrollTop();
			if (next_tr_bottom_pos > scroll_bottom)
				$scroller.animate({ scrollTop: next_tr_bottom_pos - $scroller.height() }, 200);
		},

		onRender: function() {
			this.on('itemview:answer-select', this.scrollToNextAnswer);
		}

	});

	return QuestionsView;

});
