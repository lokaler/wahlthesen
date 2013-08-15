define([

	'app',
	'bbloader',

	'hbs!../templates/layout',
	
], function (

	app,
	Backbone,

	template

) {

	var DialogLayout = Backbone.Marionette.Layout.extend({

		tagName: 'div',
		template: template,

		regions: {
			region_content: '#dialog-content'
		},

		events: {
			'click button[name=close]': 'closeButton'
		},

		showContentView: function(view) {
			this.region_content.show(view);
			this.$el.addClass('visible');
		},

		closeButton: function() {
			this.close();
		},

		onClose: function() {
			this.$el.removeClass('visible');
		}

	});

	return DialogLayout;

});
