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
			'click button[name=start]': 'clickStartButton'
		},

		modelEvents: { all: 'render' },

		clickStartButton: function() {
			if (!this.$('button[name=start]').hasClass('disabled'))
				this.trigger('start');
		},

		enableStartButton: function() {
			// this.$('button[name=start]').removeClass('disabled');
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
