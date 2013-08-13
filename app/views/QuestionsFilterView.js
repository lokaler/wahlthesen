define([

	'app',
	'lodash',
	'bbloader'

], function (
	app,
	_,
	Backbone

) {

	var QuestionsFilterView = Backbone.Marionette.ItemView.extend({

		template: '#template-questions-filter',

		serializeData: function() {
			var r = {};
			_.each(this.model.attributes, function(v, k) {
				r[k] = v ? 'selected' : '';
			});
			return r;
		},

		events: {
			'click .checkbox': 'clickCheckBox',
			'click label': 'clickLabel'
		},

		modelEvents: {
			'change': 'render'
		},

		clickCheckBox: function(evt) {
			this.triggerToggle(this.$(evt.target));
		},

		clickLabel: function(evt) {
			this.triggerToggle(this.$(evt.target).siblings('.checkbox'));
		},

		triggerToggle: function($cb) {
			var field = $cb.attr('id').substr(7);
			this.trigger('filter-toggle', this.model, field, !$cb.hasClass('selected'));
		}

	});

	return QuestionsFilterView;

});
