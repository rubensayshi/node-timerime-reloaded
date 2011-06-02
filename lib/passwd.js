var crypto			= require('crypto'),
	salt			= 'rawr';

//Used to generate a hash of the plain-text password + salt
function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

exports = module.exports = {
	salt			: function() { return salt; },
	md5 			: md5		
};