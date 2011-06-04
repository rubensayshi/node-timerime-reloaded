var crypto			= require('crypto'),
	auth			= require('../lib/auth'),
	core			= require('../lib/core');

exports = module.exports = function(app) {		
	app.get('/restricted', auth.acl({nom: 'cookie'}), function(req, res) {
		core.render('plain.html', {header: 'Restricted', content: 'Wahoo! restricted area'}, res);
	});
	
	app.get('/logout', function(req, res) {
		// destroy the user's session to log them out
		// will be re-created next request
		req.session.destroy(function() {
			res.redirect('home');
		});
	});
	
	app.get('/login', function(req, res) {
		if (req.session.user) {
			core.render('plain.html', {header: 'Login', content: 'Already authenticated as ' + req.session.user.username}, res);
		}
		else
		{
			core.render('login.html', {}, res);
		}
	});
	
	app.post('/login', function(req, res) {
		auth.authenticate(req.body.username, req.body.password, function(err, user) {
			if (user) {
				// Regenerate session when signing in
				// to prevent fixation 
				req.session.regenerate(function() {
					// Store the user's primary key 
					// in the session store to be retrieved,
					// or in this case the entire user object
					req.session.user = user;
					res.redirect('back');
				});
			} else {
				core.render('plain.html', {header: 'Login', content: 'Authentication failed, please check your username and password.'}, res);
			}
		});
	});
};