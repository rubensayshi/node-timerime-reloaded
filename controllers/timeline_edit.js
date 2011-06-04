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
	app.get('/timeline/edit/:timeline_slug', auth.restrict, function(req, res) {
		async.waterfall([
      		function(callback) {
      			// fetch categories
      			timelines_repo.findOne({slug : req.params['timeline_slug']}, callback);
      		},
      		function(timeline, callback) {
      			if(auth.check_acl(req.session.user, JSON.stringify({edit_timeline: timeline._id}))) {
      				callback(null, timeline);
      			} else {
      				callback(new Error('Access denied'));
      			}
      		}], function(error, timeline) {
				if(error) {
					core.render('plain.html', {header: 'Error', content: error.message}, res);
				} else {
					core.render('timeline_edit.html', {timeline: timeline}, res);
				}
			}
		);
	});
};