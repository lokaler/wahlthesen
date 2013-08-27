require.config({
	deps: ['main'],
	paths: {
		"jquery":            "../lib/jquery/jquery-1.10.2",
		"jquery-cookie-amd": "../lib/jquery/jquery.cookie-1.3.1",
		"jquery-color-amd":  "../lib/jquery/jquery.color",
		'lodash':            '../lib/lodash.underscore-1.3.1',
		'underscore.string': '../lib/underscore.string',

		'backbone':              '../lib/backbone/backbone',
		'backbone.marionette':   '../lib/backbone/backbone.marionette-1.1.0',
		
		"text": "../lib/require-plugins/text",
		"hbs":  "../lib/require-plugins/hbs",

		"Handlebars" : "../lib/handlebars/Handlebars",

		"hbs/underscore" :     "../lib/require-plugins/hbs/underscore",
		"hbs/i18nprecompile" : "../lib/require-plugins/hbs/i18nprecompile",
		"hbs/json2" :          "../lib/require-plugins/hbs/json2"
	},

	map: {
		"*": {
			"underscore": "lodash",
			"jquery.cookie": "jquery-cookie-amd",
			"jquery.color": "jquery-color-amd",
			// see TODO above
			// "hbs/underscore" : "lodash",
		}
	},

	shim: {
		'backbone': {
			'deps': ['jquery', 'underscore'],
			'exports': 'Backbone'
		},

		'backbone.marionette': {
			'deps': ['backbone'],
			'exports': 'Marionette'
		},
		
		'backbone.super': {
			'deps': ['backbone']
		}
	},

	hbs : {
		templateExtension : 'hbs',
		excludeHbs: false,
		disableI18n : true,
		helperPathCallback: function (name) {
			return 'templates/helpers/' + name;
		}
	}
});
