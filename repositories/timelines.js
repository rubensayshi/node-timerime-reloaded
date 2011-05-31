var mongoose		= require('mongoose'),
	async			= require('async'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem');

var timelines = {};
timelines.args = function(_cond, _fields, _options, _callback)
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

timelines.find = function(_cond, _fields, _options, _finish)
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

timelines.findOne = function(_cond, _fields, _options, _finish)
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

timelines.popular = function(_cond, _fields, _options, _callback)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _callback);
	cond = args[0], fields = args[1], options = args[2], callback = args[3];

	// sort DESC on rating
	options.sort.rating = -1;
	
	timelines.find(cond, fields, options, callback);
};

timelines.newcreated = function(_cond, _fields, _options, _callback)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _callback);
	cond = args[0], fields = args[1], options = args[2], callback = args[3];

	// sort DESC on created
	options.sort.created = -1;
	
	timelines.find(cond, fields, options, callback);
};

timelines.recentupdated = function(_cond, _fields, _options, _callback)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _callback);
	cond = args[0], fields = args[1], options = args[2], callback = args[3];

	// sort DESC on updated
	options.sort.updated = -1;
	
	timelines.find(cond, fields, options, callback);
};

exports = module.exports = timelines;