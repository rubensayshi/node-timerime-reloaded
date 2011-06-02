var mongoose		= require('mongoose'),
	Channel			= mongoose.model('Channel');

function init(req, res, next) {
	Channel.findOne({title : 'Portal'}, function(error, doc) {
		if(!error && doc) {
			req.channel = doc;
			return next();
		}	
		
		next(new Error('Failed to load channel'));
	});
}

exports = module.exports = {
	init		: init
};