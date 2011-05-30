var core			= require('../lib/core'),
	mongoose		= require('mongoose'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem');

module.exports = exports = function(app) {
	app.get('/timelines/:category_slug', function(req, res) {
		core.render('timelines.html', {}, function (error, result) {
	        if (error) {
	            console.log(error);
	        } else {
	        	res.send(result);
	        }
	    });
	});
	
	app.get('/timeline/:timeline_slug', function(req, res) {
		Timeline.find({slug : req.params['timeline_slug']}, function(error, docs) {
			if(docs.length) {
				timeline = docs.shift();
				
				core.render('timeline.html', {timeline : timeline}, function (error, result) {
			        if (error) {
			            console.log(error);
			        } else {
			        	res.send(result);
			        }
			    });
			}
			else
			{
	            console.log('no timeline found');
			}
		});
	});
};