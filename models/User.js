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


mongoose.model('User', User);

