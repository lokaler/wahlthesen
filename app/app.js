define([

	'jquery',
	'underscore',
	'bbloader'

], function($, _, Backbone) {

	// String proto
	String.prototype.format = function() {
		var args = Array.prototype.slice.call(arguments);
		return underscore_string.sprintf.apply(null, [this].concat(args));
	};

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
				region_table: '#questions-table'
			}
		});

		App.layout = new AppLayout();
		App.region_main.show(App.layout);
	};

	$(window).resize(function(evt) { App.trigger('resize', evt) });

	return App;
});
