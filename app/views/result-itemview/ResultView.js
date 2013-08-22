define([

	'app',
	'lodash',
	'bbloader',

	'text!./template.html'

], function (

	app,
	_,
	Backbone,

	template

) {

	var ResultView = Backbone.Marionette.ItemView.extend({

		name: 'ResultView',
		template: _.template(template),
		selected_party: null,
		
		events: {
			'click .btn-wrapper': 'clickParty'
		},

		/**
		 * context could look like this:
		 * {
		 *   main: {
		 *     name:  'gruene',
		 *     class: 'Grüne',
		 *     vlaue: '78'
		 *   },
		 *   others: [
		 *     {
		 *       name:  'Linke',
		 *       class: 'linke',
		 *       vlaue: '71'
		 *     },
		 *     {
		 *       name:  'Piraten',
		 *       class: 'piraten',
		 *       vlaue: '62'
		 *     },
		 *     [...]
		 *   ]
		 * }
		 */
		serializeData: function(model) {
			var n = App.data.names.parteien, r, parties, main;

			// sort by value (descending)
			parties = _(this.model.attributes)
				.chain()
				.map(function(v, k) { return [k, v]; })
				.sortBy(function(a) { return -a[1]; })
				.map(function(party) {
					return {
						name: n[party[0]],
						class: party[0],
						value: party[1]
					};
				})
				.value();

			return { parties: parties };

			// highest value becomes main
			main = parties.shift();
			ctx = {
				main: main,
				others : []
			};

			// append rest
			_.each(parties, function(p) {
				ctx.others.push(p);
			});

			return ctx;
		},

		clickParty: function(evt) {
			var party = evt.currentTarget.attributes['data-party'].textContent;
			this.$('.btn-wrapper').removeClass('selected');
			if (this.selected_party == party) {
				this.selected_party = null;
				this.trigger('party-selected', party, false);
			} else {
				$(evt.currentTarget).addClass('selected');
				this.selected_party = party;
				this.trigger('party-selected', party, true);
			}
		}
	});

	return ResultView;

});
