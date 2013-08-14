define([

	'underscore.string'

], function(underscore_string) {
	
	String.prototype.format = function() {
		var args = Array.prototype.slice.call(arguments);
		return underscore_string.sprintf.apply(null, [this].concat(args));
	};

});
