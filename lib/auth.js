var mongoose		= require('mongoose'),
	passwd			= require('../lib/passwd'),
	User			= mongoose.model('User');

function authenticate(username, password, fn) {	
	User.findOne({username : username}, function(error, user) {
		if(!error && user) {
			if(user.password == passwd.md5(password + user.salt)) {
				return fn(null, user);
			}
			else {
				return fn(new Error('Invalid login'));
			}
		}
		
		return fn(new Error('Cannot find user'));
	});
}

function acl(rule) {
	return function(req, res, next) {
		if(check_acl(req.session.user, rule))
			next();

		res.redirect('/login');
	};
}

function check_acl(user, rule) {	
	return (user && user.acl.indexOf(rule) > -1);
}

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

exports = module.exports = {
	authenticate	: authenticate,
	restrict		: restrict,
	acl				: acl,
	check_acl		: check_acl
};