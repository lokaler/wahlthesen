define([
	
	'bbloader',
	'hbs!../templates/title-and-content',

], function (

	app,
	template

) {

	var TitleAndContent = Backbone.Marionette.ItemView.extend({ template: template });

	return TitleAndContent;

});
