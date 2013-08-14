define([
	
	'app',
	'lodash',
	'bbloader',
	
	// './tools/MapTools',

	'./View',
	
		'jquery.cookie'

], function (
	
	app,
	_,
	Backbone,

	// MapTools,

	View

) {

	/**
	 * This module is serves as a place for things and thangs that are
	 * only needed in developer mode, e.g. showing active media query,
	 * to place a button for testing things etc...
	 * @class DevtoolsModule
	 */
	var DevtoolsModule = Backbone.Model.extend({

		defaults: {
			open: null
		},

		initialize: function() {
			App.layout.$el.append('<div id="devtools"/>');
			App.layout.addRegion('region_devtools', '#devtools');
			var view = new View({ model: this });
			App.layout.region_devtools.show(view);
			
			// this.map_tools = new MapTools();

			var open = !!parseInt($.cookie('devtools-open'));
			this.on('change:open', function() {
				var open = this.get('open');
				$.cookie('devtools-open', open + 0);
				// this.map_tools.enable(open);
			});
			this.set('open', open);
		},
	});

	return DevtoolsModule;

});
