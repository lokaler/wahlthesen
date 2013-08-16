define([

	'app',

	'bbloader',
	'lodash'

], function(

	App,

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

		/**
		 * Calculates which party is closest to user answers. eg.:
		 * {
		 *   cdu: 64.696,
		 *   csu: 64.678,
		 *   fdp: 67.188,
		 *   fw: 64.341,
		 *   gruene: 62.301,
		 *   linke: 62.017,
		 *   piraten: 63.376,
		 *   spd: 64.185
		 * }
		 * Notes:
		 * - higher percentage means higher agreement with party average
		 * - value of 100% defined as: same opinion in every question
		 * - value of 0 % defined as: highest possible distance
     *   (=opposite opinion) for every question (that is delta is 4 !)
		 */
		calculate: function() {
			var that = this;
			var i, j, parteien_keys = _.keys(App.data.names.parteien);
			var avg = App.data.abgeordnete.getAveragesPerQuestion();
			var user = App.data.user_answers;

			// init data structures
			var sums = {}, total = {};
			_.each(parteien_keys, function(p) {
				sums[p] = .0;
				total[p] = 0;
			});

			// For all questions
			for (i = 0; i < avg.length; ++i) {
				var a = avg[i];
				// get user input for that question
				user_value = user.at(i).get('value');
				user_weight = user.at(i).get('double_weight') === true ? 2. : 1.;
				if (user_value === undefined)
					throw('Error: User question is not answered!');
				// For all partys
				for (j = 0; j < parteien_keys.length; ++j) {
					p = parteien_keys[j];
					// delta is the distance between the user answer the party average
					delta = Math.abs(user_value - a[p]);
					// each question is multiplied by user weight
					sums[p] += delta * user_weight;
					// if a question is double weighted it has to be considered twice!
					total[p] += user_weight;
				}
			}

			// Divide by number of considered questions and calculate percentage
			_.each(parteien_keys, function(p) {
				// max. distance between possible values (-2 and +2)
				var max_delta = 4.;
				var value = Math.abs(sums[p] / total[p] - max_delta) / max_delta * 100.;
				// limit accuracy to 3 digits after the comma (eg. 73.832)
				value = Math.round(value * 1000.) / 1000.;
				// save into model attributes
				that.set(p, value);
			});

			// Preserved some testing code:

			// random numbers
			// var that = this;
			// _.each(App.data.names.parteien, function(v, k) {
			// 	that.set(k, Math.floor(Math.random() * 99));
			// });

			// fixed numbers
			// that.set('fw', 81);
			// that.set('gruene', 91);
			// that.set('cdu', 93);
			// that.set('csu', 92);
			// that.set('linke', 99);
			// that.set('spd', 89);
			// that.set('fdp', 51);
			// that.set('piraten', 93);
		}

	});

	return Result;

});
