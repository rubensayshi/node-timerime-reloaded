var core			= require('../lib/core'),
	mongoose		= require('mongoose'),
	async			= require('async'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem');

var timelinesColl = {};
timelinesColl.args = function(_cond, _fields, _options, _callback)
{	
	if("function" == typeof _cond) 
		 _callback = _cond, _cond = null, _fields = null, _options = null;
	else if("function" == typeof _fields) 
		_callback = _fields, _fields = null, _options = null;
	else if("function" == typeof _options) 
		_callback = _options, _options = null;

	cond			= _cond				|| {};
	fields			= _fields			|| [];
	options			= _options			|| {};
	callback		= _callback			|| null;
	
	options.limit	= options.limit 	|| 10;
	options.sort	= options.sort	 	|| {};
	
	return [cond, fields, options, callback];
};

timelinesColl.find = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	cond = args[0], fields = args[1], options = args[2], finish = args[3];

	
	async.waterfall([
		function(callback) {
			Timeline.find(cond, fields, options, callback);
		},
		function(timelines) {
			async.map(timelines, function(timeline, callback) {
				User.findById(timeline.author_id, function(error, doc) {
					timeline.author = doc;
					callback(error, timeline);
				});
			}, function(error) {
				callback(error, timelines);
			});
		}
	], finish);
};

timelinesColl.findOne = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	cond = args[0], fields = args[1], options = args[2], finish = args[3];
		
	async.waterfall([
		function(callback) {
			Timeline.findOne(cond, fields, options, callback);
		}
	], finish);
};

timelinesColl.popular = function(_cond, _fields, _options, _callback)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _callback);
	cond = args[0], fields = args[1], options = args[2], callback = args[3];

	// sort DESC on rating
	options.sort.rating = -1;
	
	timelinesColl.find(cond, fields, options, callback);
};

timelinesColl.newcreated = function(_cond, _fields, _options, _callback)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _callback);
	cond = args[0], fields = args[1], options = args[2], callback = args[3];

	// sort DESC on created
	options.sort.created = -1;
	
	timelinesColl.find(cond, fields, options, callback);
};

timelinesColl.recentupdated = function(_cond, _fields, _options, _callback)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _callback);
	cond = args[0], fields = args[1], options = args[2], callback = args[3];

	// sort DESC on updated
	options.sort.updated = -1;
	
	timelinesColl.find(cond, fields, options, callback);
};

var categoriesColl = {};
categoriesColl.args = function(_cond, _fields, _options, _callback)
{	
	if("function" == typeof _cond) 
		 _callback = _cond, _cond = null, _fields = null, _options = null;
	else if("function" == typeof _fields) 
		_callback = _fields, _fields = null, _options = null;
	else if("function" == typeof _options) 
		_callback = _options, _options = null;

	cond			= _cond				|| {};
	fields			= _fields			|| [];
	options			= _options			|| {};
	callback		= _callback			|| null;
	
	return [cond, fields, options, callback];
};

categoriesColl.findOne = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	cond = args[0], fields = args[1], options = args[2], finish = args[3];
		
	async.waterfall([
		function(callback) {
			Category.findOne(cond, fields, options, callback);
		}
	], finish);
};

categoriesColl.find = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	cond = args[0], fields = args[1], options = args[2], finish = args[3];
	
	async.waterfall([
		function(callback) {
			Category.find(cond, fields, options, callback);
		}
	], finish);
};

module.exports = exports = function(app) {	
	app.get('/', function(req, res) {	
		async.waterfall([
     		function(callback) {
     			// fetch categories
     			categoriesColl.find(callback);
     		},
     		function(categories, callback) {
     			// fetch popular
     			timelinesColl.popular({}, [], {limit : 8}, function(error, docs) { callback(error, categories, docs); });
     		},
     		function(categories, popular, callback) {
     			// fetch newcreated
     			timelinesColl.newcreated({}, [], {limit : 4}, function(error, docs) { callback(error, categories, popular, docs); });
     		},
     		function(categories, popular, newcreated, callback) {
     			// fetch recentupdated
     			timelinesColl.recentupdated({}, [], {limit : 4}, function(error, docs) { callback(error, categories, popular, newcreated, docs); });
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
      			categoriesColl.findOne({slug : req.params['category_slug']}, callback);
      		},
      		function(category, callback) {
      			// fetch timelines
      			timelinesColl.find({category_ids: category._id}, [], {limit : 16}, function(error, docs) { callback(error, category, docs); });
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
       			timelinesColl.findOne({slug : req.params['timeline_slug']}, callback);
       		},
       		function(timeline, callback) {
       			// fetch timeline-items
       			callback(null, timeline, []);
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
};