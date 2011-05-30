var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var User = new Schema({
	username	: String,
	email		: String,
	password	: String,
	name		: String,
	created		: Date
});


User.pre('save', function (next) {
	if (this.isNew) {
		this.created = new Date();
	}
	
    next();
});

mongoose.model('User', User);

