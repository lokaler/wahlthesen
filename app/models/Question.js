define([

	'bbloader',
	'lodash'

], function(

	Backbone,
	_

) {

	var Question = Backbone.Model.extend({

		defaults: {
			id: undefined,
			text: undefined
		}

	});

	return Question;

});
