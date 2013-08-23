define([

	'app',
	'lodash',
	'bbloader',

	'./CommentsView',

	'text!./template.html'

], function (

	App,
	_,
	Backbone,

	CommentsView,

	template_question

) {

	var QuestionView = Backbone.Marionette.Layout.extend({

		name: 'QuestionView',
		tagName:  'div',
		template: _.template(template_question),
		regions: { comments: '.comments' },
		show_comments: false,

		initialize: function() {
			this.listenTo(this.comments, 'close', function() {
				this.show_comments = false;
				this.$el.removeClass('comments-shown');
				this.trigger('comments-close');
			}, this);
		},

		modelEvents: {
			'change:_show_comments': 'showComments'
		},

		events: {
			'click .radio-button':      'clickRadioButton',
			'click .checkbox':          'clickCheckBox',
			// 'mouseover .icon-circle':   'mouseoverCircle',
			// 'mouseout  .icon-circle':   'mouseoutCircle'
			'click .btn-toggle-comments':   'toggleComments',
		},

		clickRadioButton: function(evt) {
			if (App.evaluated)
				return;
			var $t = this.$(evt.target), $radio_buttons = this.$('.radio-button'),
			  answer_idx = 0;
			// rb already selected
			if ($t.hasClass('selected'))
				return;
			// select
			else {
				$radio_buttons.removeClass('selected');
				$t.removeClass('unselected');
				$t.addClass('selected');
				answer_idx = $radio_buttons.index($t) + 1;
			}
			// trigger select event
			this.$el.addClass('filled-in');
			this.trigger('answer-select', answer_idx - 3, evt.target);
		},

		clickCheckBox: function(evt) {
			if (App.evaluated)
				return;
			var $t = this.$(evt.target);
			$t.toggleClass('selected');
			this.trigger('answer-weight-toggle', $t.hasClass('selected'));
		},

		mouseoverCircle: function(evt) {
			// debugger;
			var party = evt.currentTarget.attributes['data-party'].textContent;
			$('div.party-avg:not(.%s)'.format(party)).addClass('dim');
			$('div.party-avg.%s'.format(party)).addClass(' highlight');
			// console.log('click in', party);
		},

		mouseoutCircle: function(evt) {
			$('div.party-avg').removeClass('dim').removeClass(' highlight');
		},

		showAllAverages: function() {
			if (App.result)
				return;
			var that = this;
			_.each(_.keys(App.data.names.parteien), function(party) {
				that.showPartyAverage(party);
			});
		},

		showPartyAverage: function(party) {
			// TODO! make this fast
			var el_width       = 14 // $el.width()
			var col_width      = 120 // this.$('.cell').outerWidth();
			var question_width = 219 // this.$('.question').outerWidth()

			var $el = this.$('.overlay > .party-avg.%s'.format(party));
			var avg = App.data.abgeordnete.getAveragesPerQuestion()[this.model.get('id')][party];
			var center = question_width + col_width / 2 + 2 * col_width - el_width / 2 + 1;
			var left = center + col_width * avg;

			// $el.css('left', left).show();
			$el[0].setAttribute('style', 'left: ' + left + 'px;'); // the line above in fast
		},

		toggleComments: function() {
			this.model.set('_show_comments', !this.model.get('_show_comments'));
		},
		
		showComments: function() {
			if (this.model.get('_show_comments')) {
				this.$el.addClass('comments-shown');
				var view = new CommentsView({ model: this.model });
				this.comments.show(view);
			} else {
				this.$el.removeClass('comments-shown');
				this.comments.close();
			}
		}
	});

	return QuestionView;

});
