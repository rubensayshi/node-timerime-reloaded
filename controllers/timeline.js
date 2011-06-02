var core			= require('../lib/core'),
	mongoose		= require('mongoose'),
	async			= require('async'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem'),
	timelines_repo	= require('../repositories/timelines'),
	categories_repo	= require('../repositories/categories');

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
       			TimelineItem.find({timeline_id : timeline}, [], {sort : {start_date: 1}}, function(error, docs) {
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
       			TimelineItem.findOne({slug : req.params['timeline_item_slug']}, callback);
       		},
       		function(timeline_item, callback) {
       			// fetch surrounding items I think ?
       			callback(null, timeline_item, []);
       		}
       	], function(error, timelineItem, surrounding) {
  			core.render('timeline_item.html', {timelineItem : timelineItem}, function (error, result) {
  		        if (error) {
  		            console.log(error);
  		        } else {
  		        	res.send(result);
  		        }
  		    });		
  		});
	});
};