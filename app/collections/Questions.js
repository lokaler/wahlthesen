define([

	'bbloader',

	'../models/Question'

], function(

	Backbone,

	Question

) {

	var Questions = Backbone.Collection.extend({

		model: Question,
		url: '/questions.json'

	});

	return Questions;

});
