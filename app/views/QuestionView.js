define([

	'app',
	'lodash',
	'bbloader'

], function (
	app,
	_,
	Backbone

) {

	var QuestionView = Backbone.Marionette.ItemView.extend({

		tagName:  'tr',
		template: '#template-question',

		events: {
			'click .radio-button': 'clickRadioButton',
			'click .checkbox':     'clickCheckBox',
		},

		clickRadioButton: function(evt) {
			var $t = this.$(evt.target);
			if ($t.hasClass('selected')) {
				$t.removeClass('selected');
			}
			else {
				this.$('.radio-button').removeClass('selected');
				$t.addClass('selected');
			}
		},

		clickCheckBox: function(evt) {
			this.$(evt.target).toggleClass('selected');
		}

	});

	return QuestionView;

});
