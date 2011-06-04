var sys 			= require('sys'),
    template_system = require('../node_modules/djangode/template/template'),
    template_loader = require('../node_modules/djangode/template/loader'),
    menu			= require('../lib/menu');

function render(tpl, data, callback) {	
	console.log(tpl + " " + typeof callback);
	if("function" != typeof callback) {
		var res = callback;
		callback	= function (error, result) {
			if (error && tpl != 'plain.html') {
				render('plain.html', {content: error}, callback);
			} else {
				res.send(result);
			}
		};
	}
		
	data.menu 	= { 
		primary: 	menu.primary.render(), 
		secondary: 	menu.secondary.render() 
	};
	
	return template_loader.load_and_render(tpl, data, callback);
}

exports = module.exports = {
	render 			: render,
	menu 			: menu,
	template_system	: template_system,
	template_loader : template_loader
};