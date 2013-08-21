define([

	'app',
	'lodash',
	'bbloader',
	'text!./template.html'

], function (

	App,
	_,
	Backbone,
	template_question

) {

	var QuestionView = Backbone.Marionette.ItemView.extend({

		name: 'QuestionView',
		tagName:  'div',
		template: _.template(template_question),
		className: 'row',

		events: {
			'click .radio-button':      'clickRadioButton',
			'click .checkbox':          'clickCheckBox'
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
				$t.addClass('selected');
				answer_idx = $radio_buttons.index($t) + 1;
			}
			// trigger select event
			this.trigger('answer-select', answer_idx - 3, evt.target);
		},

		clickCheckBox: function(evt) {
			if (App.evaluated)
				return;
			var $t = this.$(evt.target);
			$t.toggleClass('selected');
			this.trigger('answer-weight-toggle', $t.hasClass('selected'));
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
			var $el = this.$('.overlay > .party-avg.%s'.format(party));
			var avg = App.data.abgeordnete.getAveragesPerQuestion()[this.model.get('id')][party];
			var col_width = this.$('.cell').outerWidth();
			var center = this.$('.question').outerWidth() + col_width / 2 + 2 * col_width - $el.width() / 2 + 1;
			var left = center + col_width * avg;
			$el.css('left', left);
			$el.fadeIn();
		}

	});

	return QuestionView;

});