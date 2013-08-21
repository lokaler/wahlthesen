define([

	'patches/backbone',
	'jquery',
	'underscore',
	'bbloader',
	'proto',
	'text!templates/main.html'	

], function(
	
	patches_backbone,
	$,
	_,
	Backbone,
	proto,
	template_main

) {

	App = new Backbone.Marionette.Application();
	App.root = '/';
	App.data = {};
	App.addRegions({
		region_main: '#main'
	});

	App.addInitializer(function() {
		this.initAppLayout();
	});

	App.initAppLayout = function() {
		var AppLayout = Backbone.Marionette.Layout.extend({
			template: _.template(template_main),
			regions: {
				region_result: '#result',
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
