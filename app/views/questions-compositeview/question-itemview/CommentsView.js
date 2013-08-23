define(['bbloader', 'text!./template-comments.html'], function (Backbone, template) {


var CommentsView = Backbone.Marionette.CompositeView.extend({

	name: 'CommentsView',
	template: _.template(template),
	
	initialize: function() {
		App.model.on('change:selected_party', function(model) {
			var party = model.changed.selected_party;
			if (party == null)
				this.model.set('_show_comments', false);
			else
				this.render();
		}, this);
	},

	serializeData: function() {
		var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments);

		var question_id = this.model.get('id');
		var party       = App.model.get('selected_party');

		var answers =
		_.chain(App.data.abgeordnete.get('opinions'))
		.filter(function(opinion) { return opinion.party == party; })
		.map(function(opinion) {
			return _.extend(
				opinion.answers.at(question_id).attributes,
				{
					bundesland: opinion.bundesland,
					gender: opinion.gender,
					year: opinion.year
				}
			)
		})
		.filter(function(answer) {  return !!answer.note; })
		.sortBy(function(answer) {  return answer.value; })
		.value();

		data.answers = answers;
		data.party = party;

		return data;
	}
});

return CommentsView;


});
