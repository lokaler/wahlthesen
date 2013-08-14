define([
	
	'app',
	'bbloader'

], function (
	
	app,
	Backbone

) {

	var MapTools = Backbone.Model.extend({

		onMapClick: function(evt) {
			var llo = evt.latlng;
			var lla = [llo.lat, llo.lng];
			console.log('map clicked: %s - %s'.format(JSON.stringify(llo), JSON.stringify(lla)));
		},

		initialize: function(enable) {
			this.map = App.modules.map.view.mapObject;
		},
		
		enable: function(enable) {
			if (enable) {
				this.listenTo(this.map, 'click', this.onMapClick, this);
			} else {
				this.stopListening();				
			}
		}
	});

	return MapTools;

});
