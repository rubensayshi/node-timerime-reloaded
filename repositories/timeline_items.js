var mongoose		= require('mongoose'),
	async			= require('async'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem'),
	timelines_repo	= require('../repositories/timelines');

var timeline_items_repo = {};
timeline_items_repo.args = function(_cond, _fields, _options, _callback)
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
	
	options.sort	= options.sort	 	|| { start_date: 1, _id: 1 };
	
	return [cond, fields, options, callback];
};

timeline_items_repo.find = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	var cond = args[0], fields = args[1], options = args[2], finish = args[3];

	
	async.waterfall([
		function(callback) {
			TimelineItem.find(cond, fields, options, callback);
		},
		function(timeline_items, callback) {
			async.map(timeline_items, function(timeline_item, callback) {
				timelines_repo.findOne({_id : timeline_item.timeline_id}, function(error, doc) {
					timeline_item.timeline = doc;
					callback(error, timeline_item);
				});
			}, function(error) {
				callback(error, timeline_items);
			});
		}
	], finish);
};

timeline_items_repo.findOne = function(_cond, _fields, _options, _finish)
{
	// normalize the args
	var args = this.args(_cond, _fields, _options, _finish);
	var cond = args[0], fields = args[1], options = args[2], finish = args[3];
		
	async.waterfall([
		function(callback) {
			TimelineItem.findOne(cond, fields, options, callback);
		},
		function(timeline_item, callback) {		
			timelines_repo.findOne({_id : timeline_item.timeline_id}, function(error, doc) {
				timeline_item.timeline = doc;
				callback(error, timeline_item);
			});
		}
	], finish);
};

exports = module.exports = timeline_items_repo;