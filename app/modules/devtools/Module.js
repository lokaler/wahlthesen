define([
	
	'app',
	'lodash',
	'bbloader',
	
	// './tools/MapTools',

	'./View',
	
	'jquery.cookie',
	'./run'

], function (
	
	app,
	_,
	Backbone,

	// MapTools,

	View,
	run

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
			window.D = this.nodeInfo;
			
			App.layout.$el.append('<div id="devtools"/>');
			App.layout.addRegion('region_devtools', '#devtools');
			var view = new View({ model: this });
			App.layout.region_devtools.show(view);
			
			var open = !!parseInt($.cookie('devtools-open'));
			this.on('change:open', function() {
				var open = this.get('open');
				$.cookie('devtools-open', open + 0);
			});
			this.set('open', open);
		},

		nodeInfo: function(node) {
			if (!(node instanceof HTMLElement)) {
				console.error('Argument is not a HTMLElement.');
				return;
			};
			
			var nodes = [];
			appendNodeInfo(node);

			nodes.reverse();
			_.each(nodes, function(node, i) {
				var indendation = ' '.repeat(i);
				console.log(indendation, node);
				var data_view = node.attributes['data-view'];
				if (data_view) {
					console.warn('%s  ♥ View:'.format(indendation), data_view.textContent);
				}
			});
			
			function appendNodeInfo(node) {
				nodes.push(node);
				if (node.nodeName == 'HTML') return;
				appendNodeInfo(node.parentNode);
			}
		}

	});

	return DevtoolsModule;

});
