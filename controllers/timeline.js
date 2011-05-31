var core			= require('../lib/core'),
	mongoose		= require('mongoose'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem');

module.exports = exports = function(app) {	
	app.get('/', function(req, res) {
		Category.find({}, function(error, docs) {
			if(docs && docs.length) {				
				core.render('homepage.html', {categories : docs}, function (error, result) {
			        if (error) {
			            console.log(error);
			        } else {
			        	res.send(result);
			        }
			    });
				
			} else {
	            console.log('no categories found');
			}
		});
	});
	
	app.get('/timelines/:category_slug', function(req, res) {
		Category.find({slug : req.params['category_slug']}, function(error, docs) {
			if(docs && docs.length) {
				category = docs.shift();
				Timeline.find({categories : category}, function(error, docs) {	
					if(docs && docs.length) {			
						core.render('category.html', {category : category, timelines : docs}, function (error, result) {
					        if (error) {
					            console.log(error);
					        } else {
					        	res.send(result);
					        }
					    });						
					} else {
			            console.log('no timelines found in category');
					}
			    });
				
			} else {
		        console.log('no category found');
			}
		});
	});
	
	app.get('/timeline/:timeline_slug', function(req, res) {
		Timeline.find({slug : req.params['timeline_slug']}, function(error, docs) {
			if(docs && docs.length) {
				timeline = docs.shift();
				User.findById(timeline.author, function(error, doc) {
					if(doc) {
						core.render('timeline.html', {timeline : timeline, author: doc}, function (error, result) {
					        if (error) {
					            console.log(error);
					        } else {
					        	res.send(result);
					        }
					    });	
					}
				});			
			} else {
	            console.log('no timeline found');
			}
		});
	});
};