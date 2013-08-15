define([

	'app',

	'bbloader',
	'lodash',

	'./views/DialogLayout',
	'./views/TitleAndContent'

], function (

	App,

	Backbone,
	_,

	DialogLayout,
	TitleAndContentView

) {

	/**
	 * Displays a dialog.
	 * @class DialogModule
	 */
	var DialogModule = Backbone.Model.extend({

		/**
		 * Displays a view in a dialog.
		 * @param {Backbone.View} view The view to display
		 * @memberof DialogModule
		 * @instance
		 */
		
		initialize: function() {
			App.layout.$el.append('<div id="dialog"/>');
			App.layout.addRegion('region_dialog', '#dialog');
		},
		
		show: function(view) {
			var layout = new DialogLayout();
			App.layout.region_dialog.show(layout);
			layout.showContentView(view);
		},

		showViewWithContext: function(View, context) {
			var view = new View({ model: new Backbone.Model(context) });
			this.show(view);
		},

		showTitleAndContentDialog: function(title, content) {
			this.showViewWithContext(TitleAndContentView, {
				title: title,
				content: content
			});
		}

	});

	return DialogModule;

});
