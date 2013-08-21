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

		template: _.template(template),

		events: {
			'click button[name=start]': 'clickStartButton'
		},

		clickStartButton: function() {
			if (!this.$('button[name=start]').hasClass('disabled'))
				this.trigger('start');
		},

		enableStartButton: function() {
			this.$('button[name=start]').removeClass('disabled');
		}

	});

	return BottomView;

});
