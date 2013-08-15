define([

	'app',

	'bbloader',
	'lodash',

	'models/Answer',
	'collections/Answers'

], function(

	App,

	Backbone,
	_,

	Answer,
	Answers

) {

	var Abgeordnete = Backbone.Model.extend({

		defaults: {
			opinions: []
		},

		_cache: {
		},

		getAveragesPerQuestion: function() {
			if (this._cache.averages)
				return this._cache.averages;

			var questions = App.data.questions.models;
			var i, j, parteien_keys = _.keys(App.data.names.parteien);
			var avg = [], sums = [], total = [];
			var abg = this.get('opinions');
			// init sums and total to 0
			for (i = 0; i < questions.length; ++i) {
				_.each([sums, total], function(a) {
					a[i] = {};
					_.each(parteien_keys, function(p) {
						a[i][p] = 0;
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

			this._cache.averages = avg;
			return avg;
		},

		load: function() {
			var o = this.get('opinions'), that = this;
			$.ajax('wahlthesen.json', {
				success: function(r) {
					_.each(r, function(v, k) {
						var a = {
							party: v[0],
							bundesland: v[1],
							gender: v[2],
							answers: that._unpackAnswers(v[3], v[4])
						}
						o.push(a);
					});
				}
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
