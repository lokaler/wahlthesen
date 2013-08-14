define([], function() {

var inputs = [
	{
		name: 'foo',
		type: 'button',
		func: function() {
			alert('foo button clicked!');
		}
	},
	{
		name: 'bar',
		type: 'checkbox',
		checked: true,
		func: function(checked) {
			alert('bar checkbox value: ' + checked);
		}
	}
];
	
return inputs; });
