define([

	'lodash',	
	'underscore.string'

], function(

	_,
	_s

) {

	window._s = _s;

	// python-like named functions preferred

	_.each([
		
		'capitalize',
		'chop',
		'clean',
		'swapCase',
		'include',
		'count',
		'escapeHTML',
		'unescapeHTML',
		'insert',
		'isBlank',
		'join',
		['lines', 'splitlines'],
		'reverse',
		'splice',
		
		['startsWith', 'startswith'],
		['endsWith', 'endswith'],

		'strip',  // alias for trim
		'lstrip', // alias for ltrim
		'rstrip', // alias for rtrim
		
		['sprintf', 'format'],
		
		'ljust',  // alias for lpad
		'rjust',  // alias for rpad
		'center', // alias for lrpad

		'repeat',
		'toBoolean'

	], function(name) {

		var underscore_name, proto_name;

		if (_.isArray(name)) {
			underscore_name = name[0];
			proto_name      = name[1];
		} else {
			underscore_name = proto_name = name;
		}

		String.prototype[proto_name] = function() {
			return _s[underscore_name].apply(null, [this].concat(
				Array.prototype.slice.call(arguments)
			)); 
		}

	});

});