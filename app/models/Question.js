define([

	'bbloader',
	'lodash'

], function(

	Backbone,
	_

) {

	var Question = Backbone.Model.extend({

		defaults: {
			text: undefined
		}

	});

	return Question;

});
