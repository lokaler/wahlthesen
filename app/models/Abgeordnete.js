define([

	'app',

	'bbloader',
	'lodash',

	'models/Answer',
	'collections/Answers',

	'data/wahlthesen' // generated by import_csv.py

], function(

	App,

	Backbone,
	_,

	Answer,
	Answers,
	
	data_wahlthesen

) {

	var Abgeordnete = Backbone.Model.extend({

		defaults: {
			opinions: []
		},

		/**
		 * Calculates averages per party per question
		 * Result looks like this (values between -2 and 2)
		 * [
		 *   // first question
		 *   {
		 *     cdu: -1.2612612612612613,
		 *     csu: -0.8076923076923077,
		 *     fdp: -0.16326530612244897,
		 *     fw: 1.5,
		 *     gruene: 1.2307692307692308,
		 *     linke: 1.588235294117647,
		 *     piraten: 1.5714285714285714,
		 *     spd: 0.4010152284263959
		 *   },
		 *   [ 34 more... ]
		 * ]
		 */
		getAveragesPerQuestion: function() {
			if (this._averages)
				return this._averages;

			var questions = App.data.questions.models;
			var i, j, parteien_keys = _.keys(App.data.names.parteien);
			var avg = [], sums = [], total = [];
			var abg = this.get('opinions');
			// init sums and total to 0
			for (i = 0; i < questions.length; ++i) {
				_.each([sums, total], function(a) {
					a[i] = {};
					_.each(parteien_keys, function(p) {
						a[i][p] = .0;
					});
				});
			}

			// sum up answers per party
			for (i = 0; i < abg.length; ++i) {
				var a = abg[i], party = a['party'];
				for (j = 0; j < questions.length; ++j) {
					var v = a.answers.at(j).get('value');
					if (v !== undefined) { // undefined = no answer => skip
						sums[j][party] += v;
						++total[j][party];
					}
				}
			}

			// divide through total
			for (i = 0; i < questions.length; ++i) {
				var s = sums[i], t = total[i];
				avg[i] = {};
				_.each(parteien_keys, function(p) {
					avg[i][p] = s[p] / t[p];
				});
			}

			this._averages = avg;
			this._total = total;
			return avg;
		},

		/*
		 * Returns votes per question per party. Eg.:
		 * [
		 *   // first question
		 *   {
		 *     cdu: 111,
		 *     csu: 26,
		 *     fdp: 49,
		 *     fw: 10,
		 *     gruene: 104,
		 *     linke: 68,
		 *     piraten: 21,
		 *     spd: 197
		 *   },
		 *   [ 34 more ...]
		 * ]
		 */
		getVotesPerQuestion: function() {
			if (!this._total)
				getAveragesPerQuestion();
			return this._total;
		},

		load: function() {
			var o = this.get('opinions'), that = this;
			_.each(data_wahlthesen, function(v, k) {
				var a = {
					party: v[0],
					bundesland: v[1],
					gender: v[2],
					answers: that._unpackAnswers(v[3], v[4])
				}
				o.push(a);
			});
		},

		_unpackAnswers: function(a, n) {
			var answers = new Answers();
			if (n === undefined)
				n = [];
			for (var i = 0; i < a.length; ++i) {
				var v = parseInt(a[i]), answer = new Answer(i);
				answer.set('value', v == 0 ? undefined : v - 3);
				if (n[i] !== undefined)
					answer.set('note', n[i]);
				answers.push(answer);
			}
			return answers;
		}

	});

	return Abgeordnete;

});
