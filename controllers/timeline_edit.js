var core				= require('../lib/core'),
	auth				= require('../lib/auth'),
	mongoose			= require('mongoose'),
	async				= require('async'),
	timeline_items_repo	= require('../repositories/timeline_items'),
	timelines_repo		= require('../repositories/timelines'),
	categories_repo		= require('../repositories/categories');

module.exports = exports = function(app) {	
	app.get('/my_timelines', auth.restrict, function(req, res, next) {	
		timelines_repo.find({author_id : req.session.user._id}, function(error, docs) {
			if (error) {
				next(error);
			} else {
				core.render('my_timelines.html', {mytimelines: docs}, res);
			}
		});
	});
	app.get('/timeline/edit/:timeline_slug', auth.restrict, function(req, res) {
		async.waterfall([
      		function(callback) {
      			// fetch categories
      			timelines_repo.findOne({slug : req.params['timeline_slug']}, callback);
      		},
      		function(timeline, callback) {      			
      			if (auth.check_acl(req.session.user, JSON.stringify({edit_timeline: timeline._id}))) {
      				callback(null, timeline);
      			} else {
      				callback(new Error('Access denied'));
      			}
      		},
      		function(timeline, callback) {
       			// fetch timeline-items
      			timeline_items_repo.find({timeline_id : timeline}, function(error, docs) {
       				callback(error, timeline, docs);
       			});
      		}
      		], function(error, timeline, timelineItems) {
				if (error) {
					core.render('plain.html', {header: 'Error', content: error.message}, res);
				} else {
					core.render('timeline_edit.html', {timeline: timeline, timelineItems : timelineItems}, res);
				}
			}
		);
	});
	app.post('/timeline/save/:timeline_slug', auth.restrict, function(req, res) {
		async.waterfall([
      		function(callback) {
      			// fetch categories
      			timelines_repo.findOne({slug : req.params['timeline_slug']}, callback);
      		},
      		function(timeline, callback) {      			
      			if (auth.check_acl(req.session.user, JSON.stringify({edit_timeline: timeline._id}))) {
      				callback(null, timeline);
      			} else {
      				callback(new Error('Access denied'));
      			}
      		},
      		function(timeline, callback) {      			
      			if (postdata = req.body.timeline) {
      				for (prop in postdata) {
      					timeline[prop] = postdata[prop];
      				}
      			}
      			
      			timeline.save(function(error, doc) {
      				callback(error, doc);
      			});
      		}
      		], function(error, timeline) {
				if (error) {
					core.render('plain.html', {header: 'Error', content: error.message}, res);
				} else {
      				res.redirect('/timeline/edit/' + timeline.slug); 
				}
			}
		);
	});
	app.get('/timeline_item/edit/:timeline_item_slug', auth.restrict, function(req, res) {
		async.waterfall([
      		function(callback) {
      			// fetch categories
      			timeline_items_repo.findOne({slug : req.params['timeline_item_slug']}, callback);
      		},
      		function(timeline_item, callback) {      			
      			if (auth.check_acl(req.session.user, JSON.stringify({edit_timeline: timeline_item.timeline_id}))) {
      				callback(null, timeline_item);
      			} else {
      				callback(new Error('Access denied'));
      			}
      		},
      		function(timeline_item, callback) {
      			// fetch timeline-items
      			timeline_items_repo.find({timeline_id : timeline_item.timeline}, function(error, docs) {
	   				callback(error, timeline_item, docs);
	   			});
			},
       		function(timelineItem, timelineItems, callback) {
   				var prev = null;
   				var next = null;
   				var curr = false;
   				
   				async.forEachSeries(timelineItems, function(doc, callback) {
   					if (next) 
   						return callback();
   					       					
   					if (doc._id.toString() == timelineItem._id.toString()) {
   						curr = true;
   					} else if (curr) {
   						next = doc;
   					} else {       					
   						prev = doc;  
   					}
   					
   					callback();
   				}, function(error) { callback(error, timelineItem, timelineItems, prev, next); });    	       		
       		}
      		], function(error, timelineItem, timelineItems, prev, next) {
				if (error) {
					core.render('plain.html', {header: 'Error', content: error.message}, res);
				} else {
					core.render('timeline_item_edit.html', {timelineItem : timelineItem, timelineItems : timelineItems, prev : prev, next : next}, res);
				}
			}
		);
	});
	app.post('/timeline_item/save/:timeline_item_slug', auth.restrict, function(req, res) {
		async.waterfall([
      		function(callback) {
      			// fetch categories
      			timeline_items_repo.findOne({slug : req.params['timeline_item_slug']}, callback);
      		},
      		function(timeline_item, callback) {      			
      			if (auth.check_acl(req.session.user, JSON.stringify({edit_timeline: timeline_item.timeline_id}))) {
      				callback(null, timeline_item);
      			} else {
      				callback(new Error('Access denied'));
      			}
      		},
      		function(timeline_item, callback) {   
      			if (postdata = req.body.timeline_item) {
      				for (prop in postdata) {
      					timeline_item[prop] = postdata[prop];
      				}
      			}
      			
      			timeline_item.save(function(error, doc) {
      				callback(error, doc);
      			});
      		}
      		], function(error, timeline_item) {
				if (error) {
					core.render('plain.html', {header: 'Error', content: error.message}, res);
				} else {
      				res.redirect('/timeline_item/edit/' + timeline_item.slug); 
				}
			}
		);
	});
	app.get('/new_timeline', auth.restrict, function(req, res) {
		core.render('plain.html', {header: 'Work In Progress', content: 'creating a new timelines in 2823526353 way to complex steps ...'}, res);
	});
};