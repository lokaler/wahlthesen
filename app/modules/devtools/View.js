define([
	
	'app',
	
	'bbloader',
	'jquery',
	
	'./inputs', // inputs.js is ignored via .gitignore - copy inputs-example.js inputs.js to get started

	'hbs!./templates/devtools'

], function (

	App,
	
	Backbone,
	$,
	
	inputs,

	template

) {

	var DevtoolsView = Backbone.Marionette.ItemView.extend({

		name: 'DevtoolsView',
		serializeData: function() {
			var data = Backbone.Marionette.ItemView.prototype.serializeData.call(this);
			data.inputs = _.map(inputs, function(input) {
				input.is_button   = input.type == 'button';
				input.is_checkbox = input.type == 'checkbox';
				return input;
			});
			return data;
		},

		template: template,

		events: {
			'click .btn-open':     function() { this.model.set('open', true) },
			'click .btn-close':    function() { this.model.set('open', false) },
			'click  .inputs button':                 'callInputFunction',
			'change .inputs input[type="checkbox"]': 'callInputFunction'
		},

		modelEvents: {
			'change:open': 'updateOpen'
		},

		toggleOpen: function(open) {
			this.model.set(
				'open',
				!(this.model.get('open') || false)
			);
		},

		updateOpen: function() {
			var open = this.model.get('open');
			this.$('.btn-open').toggle(!open);
			this.$('.content').toggle(open);
		},

		callInputFunction: function(evt) {
			var name = evt.currentTarget.attributes.name.textContent;
			_.each(inputs, function(input) {
				if (input.name == name) {
					switch (input.type) {
					  case "button":
						input.func();
					    break;
					  case "checkbox":
						input.func(evt.currentTarget.checked);
					    break;
					  default:
					    break;
					}
					return false;
				}
			})
		}
	});

	return DevtoolsView;

});
