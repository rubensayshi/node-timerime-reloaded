var sys 			= require('sys'),
	mongoose		= require('mongoose'),	
	MenuItem		= mongoose.model('MenuItem');

menus			= {};
menus.primary 	= new MenuItem();
menus.secondary	= new MenuItem();

menus.primary.children.push(new MenuItem({title: 'Home', 		link: '/'}));
menus.primary.children.push(new MenuItem({title: 'About us', 	link: '/about'}));
menus.primary.children.push(new MenuItem({title: 'Timelines',	link: '/timelines'}));
menus.primary.children.push(new MenuItem({title: 'More', 		link: '/'}));
menus.primary.children.push(new MenuItem({title: 'Contact', 	link: '/'}));

function render(activePath) {
	activePath = activePath || '';
	output = '';

	this.children.forEach(function(item) {
		classes = (item.link == activePath) ? 'active' : '';
		output += '<li class="'+classes+'"><a href="'+item.link+'">'+item.title+'</a></li>';
	});
	
	return '<ul>'+output+'</ul>';
};

menus.primary.render = render;
exports.primary = menus.primary;