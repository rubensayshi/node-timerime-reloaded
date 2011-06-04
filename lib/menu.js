var sys 			= require('sys'),
	mongoose		= require('mongoose'),	
	MenuItem		= mongoose.model('MenuItem');

menus			= {};
menus.primary 	= new MenuItem();
menus.secondary	= new MenuItem();

menus.primary.children.push(new MenuItem({title: 'Home', 			link: '/'}));
menus.primary.children.push(new MenuItem({title: 'About us', 		link: '/about'}));
menus.primary.children.push(new MenuItem({title: 'More', 			link: '/'}));
menus.primary.children.push(new MenuItem({title: 'Contact', 		link: '/'}));

menus.secondary.children.push(new MenuItem({title: 'Login',	 		link: '/login'}));
menus.secondary.children.push(new MenuItem({title: 'My Timerime', 	link: '/my_timerime'}));
menus.secondary.children.push(new MenuItem({title: 'Logout',	 	link: '/logout'}));

function render(activePath) {
	activePath = activePath || '';
	output = '';

	this.children.forEach(function(item) {
		classes = (item.link == activePath) ? 'active' : '';
		output += '<li class="'+classes+'"><a href="'+item.link+'">'+item.title+'</a></li>';
	});
	
	return '<ul>'+output+'</ul>';
};

/*
 * bind the render method to the menus
 */
menus.primary.render 	= render;
menus.secondary.render 	= render;

/*
 * export all menus
 */
exports = module.exports = menus;
