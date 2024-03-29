define([

	'app',
	'lodash',
	'bbloader',

	'./question-itemview/QuestionItemView',
	'text!./template.html'

], function (

	app,
	_,
	Backbone,

	QuestionItemView,
	template

) {

	var QuestionsCompositeView = Backbone.Marionette.CompositeView.extend({

		name: 'QuestionsCompositeView',
		itemView:          QuestionItemView,
		itemViewContainer: '#questions-table-rows',
		template:          _.template(template),

		triggers: {
			'click button[name=start]': 'start'
		},

		initialize: function() {
			App.model.on('change:selected_party', function(model) {
				var party = model.changed.selected_party;
				this.$('#questions-table-rows').removeClass('single-party-selected');
				this.$('div.party-avg').removeClass('dim').removeClass('highlight');
				if (party != null) {
					this.$('#questions-table-rows').addClass('single-party-selected');
					this.$('div.party-avg:not(.%s)'.format(party)).addClass('dim');
					this.$('div.party-avg.%s'.format(party)).addClass(' highlight');
				}
			}, this);
			this.collection.on('change:_show_comments', function(model) {
				if (!model.changed._show_comments) return;
				this.collection.filter(function(model_) {
					if (model.id != model_.id) {
						model_.set('_show_comments', false);
					}
				});
			}, this);
		},
		
		scrollToTop: function() {
			var $scroller = this.$('#questions-table-rows-wrapper');
			$scroller.clearQueue()
				.animate({ scrollTop: 0 }, ($scroller.scrollTop() / $scroller.children().height()) * 2000);
		},

		scrollToNextAnswer: function(view, answer_idx, target) {
			var $next_row = this.$(target).parent().parent().next();
			if ($next_row.length == 0)
				return;
			var $scroller = this.$('#questions-table-rows-wrapper');
			var next_row_bottom_pos = $next_row.position().top + $next_row.height() + $scroller.scrollTop() + 100;
			var scroll_bottom = $scroller.height() + $scroller.scrollTop();
			if (next_row_bottom_pos > scroll_bottom) {
				$scroller.clearQueue()
					.animate({ scrollTop: next_row_bottom_pos - $scroller.height() }, 200);
			}
		},

		checkAnsweredQuestions: function() {
			var total = this.$('.row').length,
			num_answered = this.$('.radio-button.selected').length;
			this.trigger('num-answered', num_answered);
			if (num_answered == total)
				this.trigger('all-answered');
		},

		onRender: function() {
			this.on('itemview:answer-select', this.scrollToNextAnswer);
			this.on('itemview:answer-select', this.checkAnsweredQuestions);
		},

		showAverages: function() {
			this.children.each(function(v) { v.showAllAverages(); });
		}
	});

	return QuestionsCompositeView;

});
