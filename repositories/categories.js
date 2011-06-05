var mongoose		= require('mongoose'),
	async			= require('async'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem');

var categories_repo = {};
categories_repo.args = function(_cond, _fields, _options, _callback)
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

categories_repo.findOne = function(_cond, _fields, _options, _finish)
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

categories_repo.find = function(_cond, _fields, _options, _finish)
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


exports = module.exports = categories_repo;