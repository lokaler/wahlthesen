require.config({
	deps: ['main'],
	paths: {
		'jquery':            '../lib/jquery-1.10.2',
		'lodash':            '../lib/lodash.underscore-1.3.1',
		'underscore.string': '../lib/underscore.string',

		'backbone':              '../lib/backbone/backbone',
		'backbone.marionette':   '../lib/backbone/backbone.marionette.1.0.4/core/amd/backbone.marionette',
		'backbone.wreqr':        '../lib/backbone/backbone.marionette.1.0.4/backbone.wreqr',
		'backbone.babysitter':   '../lib/backbone/backbone.marionette.1.0.4/backbone.babysitter',
		
		"text": "../lib/require-plugins/text",
	},

	map: {
		'*': {
			'underscore': 'lodash'
		}
	},

	shim: {
		'backbone': {
			'deps': ['jquery', 'underscore'],
			'exports': 'Backbone'
		},
		
		'backbone.super': {
			'deps': ['backbone']
		}
	}
});
