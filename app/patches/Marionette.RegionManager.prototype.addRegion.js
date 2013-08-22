define(['bbloader'], function(Backbone) {
	
	var Marionette = Backbone.Marionette;
	var addRegion = Marionette.RegionManager.prototype.addRegion;
	
	// /lib/backbone/backbone.marionette.1.0.4/core/amd/backbone.marionette.js - line 563
	Marionette.RegionManager.prototype.addRegion = function() {
		var region = addRegion.apply(this, arguments);
		return region;
	}
});