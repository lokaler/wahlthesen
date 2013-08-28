define([

	'app',
	'lodash',
	'bbloader',
	'text!./template.html'

], function (

	app,
	_,
	Backbone,
	template

) {

	var BottomView = Backbone.Marionette.CompositeView.extend({

		name: 'BottomView',
		id:   'answer-progress',
		template: _.template(template),

		events: {
			'click button[name=start]': 'clickStartButton',
			'click .fill-in-questions': 'clickFillIn'
		},

		modelEvents: { all: 'render' },

		clickStartButton: function() {
			if (!this.$('button[name=start]').hasClass('disabled'))
				this.trigger('start');
		},

		clickFillIn: function() {
			App.data.user_answers.each(function(answer) {
				answer.set('value', Math.floor(Math.random() * 4) - 2);
			});
			this.trigger('start');
		},

		displayNumAnswered: function(num_answered) {
			var $btn = $('button[name=start]');
			if (num_answered < 35) {
				$btn.html(
					'%s von 35 Fragen beanwortet.'.format(num_answered)
				);
			} else {
				$btn.html(
					'Jetzt Auswertung anzeigen!'.format(num_answered)
				);
				this.$('button[name=start]').removeClass('disabled');
			}
			$('#progress-meter').css(
				'width',
				num_answered / 35 * $btn.outerWidth()
			); 
		}
	});

	return BottomView;

});
