define([

	'bbloader',
	'./Marionette.RegionManager.prototype.addRegion'

], function(Backbone) {

	view_instances = {};

	function addViewInstance(view) {
		if (!view.name) return;
		view_instances[view.name] = view;
	}

	function wrapInStartEndComments(html, comment) {
		return '<!-- START - %s -->\n%s\n<!-- END - %s -->'.format(
			comment,
			html,
			comment
		);
	}

	Backbone.Marionette.ItemView.prototype.render = function() {
		// patch - START
		addViewInstance(this);
		// patch - END

		this.isClosed = false;
		
		this.triggerMethod("before:render", this);
		this.triggerMethod("item:before:render", this);
		
		var data = this.serializeData();
		data = this.mixinTemplateHelpers(data);
		
		var template = this.getTemplate();
		var html = Backbone.Marionette.Renderer.render(template, data);
		
		// patch - START
		if (this.name) html = wrapInStartEndComments(html, 'view: %s'.format(this.name));
		// patch - END
		
		this.$el.html(html);
		
		// patch - START
		if (this.name) this.$el.attr('data-view', this.name);
		// patch - END

		this.bindUIElements();
		
		this.triggerMethod("render", this);
		this.triggerMethod("item:rendered", this);
		
		return this;
	}
	
	Backbone.Marionette.CompositeView.prototype.render = function() {
		this.isRendered = true;
		this.isClosed = false;
		this.resetItemViewContainer();
		
		this.triggerBeforeRender();
		var html = this.renderModel();

		// patch - START
		if (this.name) html = wrapInStartEndComments(html, 'view: %s'.format(this.name));
		// patch - END

		this.$el.html(html);

		// patch - START
		if (this.name) this.$el.attr('data-view', this.name);
		// patch - END

		// the ui bindings is done here and not at the end of render since they 
		// will not be available until after the model is rendered, but should be
		// available before the collection is rendered.
		this.bindUIElements();
		this.triggerMethod("composite:model:rendered");
		
		this._renderChildren();
		
		this.triggerMethod("composite:rendered");
		this.triggerRendered();
		return this;
	}
});
