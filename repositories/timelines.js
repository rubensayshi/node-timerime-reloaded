var mongoose		= require('mongoose'),
	async			= require('async'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem');

var timelines_repo = {};
timelines_repo.args = function(_cond, _fields, _options, _callback)
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

timelines_repo.find = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	var cond = args[0], fields = args[1], options = args[2], finish = args[3];

	
	async.waterfall([
		function(callback) {
			Timeline.find(cond, fields, options, callback);
		},
		function(timelines, callback) {		
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

timelines_repo.findOne = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	var cond = args[0], fields = args[1], options = args[2], finish = args[3];
		
	
	async.waterfall([
		function(callback) {
			Timeline.findOne(cond, fields, options, callback);
		},
		function(timeline, callback) {			
			User.findById(timeline.author_id, function(error, doc) {
				timeline.author = doc;
				callback(error, timeline);
			});
		}
	], finish);
};

exports = module.exports = timelines_repo;