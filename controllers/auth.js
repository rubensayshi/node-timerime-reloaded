var crypto			= require('crypto'),
	auth			= require('../lib/auth'),
	core			= require('../lib/core');

exports = module.exports = function(app) {		
	app.get('/restricted', auth.acl({nom: 'cookie'}), function(req, res) {
		res.send('Wahoo! restricted area');
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
			res.send('Already authenticated as ' + req.session.user.username);
		}
		else
		{
			core.render('login.html', {}, function (error, result) {
				if (error) {
					console.log(error);
				} else {
					res.send(result);
				}
			});
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
				res.send('Authentication failed, please check your username and password.');
			}
		});
	});
};