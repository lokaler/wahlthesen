define([

	'jquery',
	'underscore',
	'bbloader',
	'proto'

], function($, _, Backbone) {

	App = new Backbone.Marionette.Application();
	App.root = '/';
	App.addRegions({
		region_main: '#main'
	});

	App.addInitializer(function() {
		this.initAppLayout();
	});

	App.initAppLayout = function() {
		var AppLayout = Backbone.Marionette.Layout.extend({
			template: '#template-main',
			regions: {
				region_filter: '#filter',
				region_table:  '#questions-table',
				region_bottom: '#bottom'
			}
		});

		App.layout = new AppLayout();
		App.region_main.show(App.layout);
	};

	$(window).resize(function(evt) { App.trigger('resize', evt) });

	return App;
});
