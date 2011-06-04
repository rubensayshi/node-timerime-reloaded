var core			= require('../lib/core'),
	auth			= require('../lib/auth'),
	mongoose		= require('mongoose'),
	async			= require('async'),
	User	 		= mongoose.model('User'),
	Category 		= mongoose.model('Category'),
	Timeline 		= mongoose.model('Timeline'),
	TimelineItem	= mongoose.model('TimelineItem'),
	timelines_repo	= require('../repositories/timelines'),
	categories_repo	= require('../repositories/categories');

module.exports = exports = function(app) {	
	app.get('/my_timerime', auth.restrict, function(req, res, next) {	
		timelines_repo.find({author_id : req.session.user._id}, function(error, docs) {
			if(error) {
				next(error);
			} else {
				core.render('my_timerime.html', {mytimelines: docs}, res);
			}
		});
	});
	app.get('/timeline/edit/:timeline_slug', auth.restrict, function(req, res, next) {
		async.waterfall([
      		function(callback) {
      			// fetch categories
      			timelines_repo.findOne({slug : req.params['timeline_slug']}, callback);
      		},
      		function(timeline, callback) {
      			if(auth.check_acl(req.session.user, {edit_timeline: timeline._id.toString() })) {
      				next(null, timeline);
      			} else {
      				next(new Error('Access denied'));
      			}
      		}], function(timeline) {
				core.render('timeline_edit.html', {timeline: timeline}, res);
			}
		);
	});
};