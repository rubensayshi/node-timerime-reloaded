var core = require('../lib/core')

module.exports = exports = function(app) {
	app.get('/timelines', function(req, res){
		core.render('timelines.html', {}, function (error, result) {
	        if (error) {
	            console.log(error);
	        } else {
	        	res.send(result);
	        }
	    });
	});
	app.get('/timeline/:id', function(req, res) {
		console.log(req.params['id']);
		core.render('timeline.html', {timeline : {id : req.params['id']}}, function (error, result) {
	        if (error) {
	            console.log(error);
	        } else {
	        	res.send(result);
	        }
	    });
	});
};