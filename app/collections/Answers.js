define([

	'bbloader',
	'lodash',

	'../models/Answer'

], function(

	Backbone,
	_,

	Answer

) {

	var Answers = Backbone.Collection.extend({

		model: Answer

	});

	return Answers;

});
