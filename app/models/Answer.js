define([

	'bbloader',
	'lodash'

], function(

	Backbone,
	_

) {

	var Answer = Backbone.Model.extend({

		defaults: {
			question_id: undefined,
			value: 0,
			double_weight: false
		},

		initialize: function(question_id) {
			if (question_id === undefined)
				throw 'Answer needs a question_id!';
			this.set('question_id', question_id);
		}

	});

	return Answer;

});
