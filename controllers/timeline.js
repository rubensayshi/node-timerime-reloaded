var core				= require('../lib/core'),
	mongoose			= require('mongoose'),
	async				= require('async'),
	timelines_repo		= require('../repositories/timelines'),
	timeline_items_repo	= require('../repositories/timeline_items'),
	categories_repo		= require('../repositories/categories');

module.exports = exports = function(app) {	
	app.get('/', function(req, res) {	
		async.waterfall([
     		function(callback) {
     			// fetch categories
     			categories_repo.find(callback);
     		},
     		function(categories, callback) {
     			// fetch popular
     			timelines_repo.find({channel_ids: req.channel}, [], {sort : {rating : -1}, limit : 8}, function(error, docs) { callback(error, categories, docs); });
     		},
     		function(categories, popular, callback) {
     			// fetch newcreated
     			timelines_repo.find({channel_ids: req.channel}, [], {sort : {created : -1}, limit : 4}, function(error, docs) { callback(error, categories, popular, docs); });
     		},
     		function(categories, popular, newcreated, callback) {
     			// fetch recentupdated
     			timelines_repo.find({channel_ids: req.channel}, [], {sort : {updated : -1}, limit : 4}, function(error, docs) { callback(error, categories, popular, newcreated, docs); });
     		}
     	], function(error, categories, popular, newcreated, recentupdated) {
			core.render('homepage.html', {
					categories 		: categories, 
					popular 		: popular,
					newcreated 		: newcreated,
					recentupdated 	: recentupdated
				}, function (error, result) {
		        if (error) {
		            console.log(error);
		        } else {
		        	res.send(result);
		        }
		    });		
		});
	});
	
	app.get('/timelines/:category_slug', function(req, res) {
		async.waterfall([
      		function(callback) {
      			// fetch category
      			categories_repo.findOne({slug : req.params['category_slug']}, callback);
      		},
      		function(category, callback) {
      			// fetch timelines
      			timelines_repo.find({category_ids: category._id}, [], {limit : 16}, function(error, docs) { callback(error, category, docs); });
      		}
      	], function(error, category, timelines) {
 			core.render('category.html', {category : category, timelines : timelines}, function (error, result) {
 		        if (error) {
 		            console.log(error);
 		        } else {
 		        	res.send(result);
 		        }
 		    });		
 		});
	});
	
	app.get('/timeline/:timeline_slug', function(req, res) {
		async.waterfall([
       		function(callback) {
       			// fetch timeline
       			timelines_repo.findOne({slug : req.params['timeline_slug']}, callback);
       		},
       		function(timeline, callback) {
       			// fetch timeline-items
       			timeline_items_repo.find({timeline_id : timeline}, function(error, docs) {
       				callback(error, timeline, docs);
       			});
       		}
       	], function(error, timeline, timelineItems) {
  			core.render('timeline.html', {timeline : timeline, timelineItems : timelineItems}, function (error, result) {
  		        if (error) {
  		            console.log(error);
  		        } else {
  		        	res.send(result);
  		        }
  		    });		
  		});
	});
	
	app.get('/timeline_item/:timeline_item_slug', function(req, res) {
		async.waterfall([
       		function(callback) {
       			// fetch timeline_item
       			timeline_items_repo.findOne({slug : req.params['timeline_item_slug']}, callback);
       		},
       		function(timelineItem, callback) {
       			timeline_items_repo.find({timeline_id : timelineItem.timeline_id}, function(error, docs) {
       				var prev = null;
       				var next = null;
       				var curr = false;
       				
       				async.forEachSeries(docs, function(doc, callback) {
       					if(next) 
       						return callback();
       					       					
       					if (doc._id.toString() == timelineItem._id.toString()) {
       						curr = true;
       					} else if(curr) {
       						next = doc;
       					} else {       					
       						prev = doc;  
       					}
       					
       					callback();
       				}, function(error) { callback(error, timelineItem, prev, next); });
       			});       	       		
       		}
       	], function(error, timelineItem, prev, next) {
			
  			core.render('timeline_item.html', {timelineItem : timelineItem, prev : prev, next : next}, function (error, result) {
  		        if (error) {
  		            console.log(error);
  		        } else {
  		        	res.send(result);
  		        }
  		    });		
  		});
	});
};