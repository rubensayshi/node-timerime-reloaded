var mongoose		= require('mongoose'),
	passwd			= require('../lib/passwd'),
	User			= mongoose.model('User');

function authenticate(name, pass, fn) {	
	User.findOneBy({username : name}, function(error, doc) {
		if(!error && doc) {
			if(user.pass == passwd.md5(pass + user.salt)) {
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
		if(req.session.user) {
			if(req.session.user.acl.indexOf(rule) > -1) {
				next();
			}
		}

		req.session.error = 'Access denied!';
		res.redirect('/login');
	};
}

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
}

exports = module.exports = {
	authenticate	: authenticate,
	restrict		: restrict,
	acl				: acl
};