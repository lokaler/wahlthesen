define([

	'bbloader',
	'lodash'

], function(

	Backbone,
	_

) {

	var Result = Backbone.Model.extend({

		defaults: {
		},

		initialize: function(answers, abgeordnete) {
			if (answers === undefined)
				throw 'Result needs answers!';
			if (abgeordnete === undefined)
				throw 'Result needs abgeordnete!';
			this.answers = answers;
			this.abgeordnete = abgeordnete;
			this.calculate();
		},

		calculate: function() {
			var that = this;
			_.each(App.data.names.parteien, function(v, k) {
				console.info('Calculating %s'.format(k));
				that.set(k, 78);
			});
		}

	});

	return Result;

});
