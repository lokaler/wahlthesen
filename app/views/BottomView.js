define([

	'app',
	'lodash',
	'bbloader',
	'text!templates/bottom.html'

], function (

	app,
	_,
	Backbone,
	template_bottom

) {

	var BottomView = Backbone.Marionette.CompositeView.extend({

		template: _.template(template_bottom),

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
