var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var MenuItem = new Schema({
	title		: String,
	link		: String,
	children	: [MenuItem]
});


mongoose.model('MenuItem', MenuItem);

