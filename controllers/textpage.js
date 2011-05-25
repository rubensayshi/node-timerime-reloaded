module.exports = function(app) {
	app.get("/page", 	page);
	app.get("/pagee",	pagee);
}

function page(req, res) {
	res.send('page');
}
function pagee(req, res) {
	res.send('pagee');
}