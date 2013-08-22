define([
	
	'text!./data/user-answers-example.json'
	
], function(
	
	user_answers_example
	
) {

var inputs = [
	{
		name: 'random-answers',
		type: 'button',
		func: function() {
			$('.row').each(function() {
				var i = Math.floor(Math.random() * 4);
				$(this).find('.radio-button:eq(' + i + ')').click();
			});
			$('button[name="start"]').click();
		}
	},
	{
		name: 'load-answers',
		type: 'button',
		func: function() {
			var data = JSON.parse(user_answers_example);
			$('.row').each(function(i, row) {
				var answer = data[i].value - 1;
				$(this).find('.radio-button:eq(%s)'.format(answer)).click();
			});
			$('button[name="start"]').click();
		}
	},
	{
		name: 'load-answers-minus-1',
		type: 'button',
		func: function() {
			var data = JSON.parse(user_answers_example);
			$('.row').slice(1).each(function(i, row) {
				var answer = data[i].value - 1;
				$(this).find('.radio-button:eq(%s)'.format(answer)).click();
			});
		}
	}
];
	
return inputs; });

