var sys 			= require('sys'),
    template_system = require('../node_modules/djangode/template/template'),
    template_loader = require('../node_modules/djangode/template/loader'),
    menu			= require('../lib/menu');

function render(tpl, data, callback)
{
	data.menu = { 
		primary: 	menu.primary.render() 
	};
	return template_loader.load_and_render(tpl, data, callback);
}

exports.render 			= render;
exports.menu 			= menu;
exports.template_system = template_system;
exports.template_loader = template_loader;