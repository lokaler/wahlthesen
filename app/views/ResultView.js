define([

	'app',
	'lodash',
	'bbloader',

	'text!templates/result.html'

], function (

	app,
	_,
	Backbone,

	template

) {

	var ResultView = Backbone.Marionette.ItemView.extend({

		template: _.template(template),

		serializeData: function(model) {
			var n = App.data.names.parteien, r, parteien, main;

			parteien = _(this.model.attributes)
				.chain()
				.map(function(v, k) { return [k, v]; })
				.sortBy(function(a) { return -a[1]; })
				.value();

			main = parteien.shift();
			r = {
				main: {
					name: n[main[0]],
					class: main[0],
					value: main[1]
				},
				others : []
			};

			_.each(parteien, function(p) {
				r.others.push({
					name: n[p[0]],
					class: p[0],
					value: p[1]
				});
			});

			return r;
		}

	});

	return ResultView;

});
