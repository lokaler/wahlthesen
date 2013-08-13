define([

	'bbloader',
	'lodash',

	'models/Answer',
	'collections/Answers'

], function(

	Backbone,
	_,

	Answer,
	Answers

) {

	var Abgeordnete = Backbone.Model.extend({

		defaults: {
			opinions: []
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
