define([

	'bbloader',
	'lodash'

], function(

	Backbone,
	_

) {

	var QuestionsFilter = Backbone.Model.extend({

		defaults: {
			average: true,
			abgeordnete: false,
			user: true
		}

	});

	return QuestionsFilter;

});
