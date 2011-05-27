var sys 			= require('sys'),
	mongoose		= require('mongoose'),	
	MenuItem		= mongoose.model('MenuItem'),
	menu 			= new MenuItem();

menu.children.push(new MenuItem({title: 'Home', 		link: '/'}));
menu.children.push(new MenuItem({title: 'About us', 	link: '/about'}));
menu.children.push(new MenuItem({title: 'More', 		link: '/'}));
menu.children.push(new MenuItem({title: 'Contact', 		link: '/'}));

function render()
{	
	output = '';
	
	menu.children.forEach(function(item) {
		output += '<li><a href="'+item.link+'">'+item.title+'</a></li>';
	});
	
	return '<ul>'+output+'</ul>';
}

exports.render = render;