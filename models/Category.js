var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var Category = new Schema({
	title		: String
});

mongoose.model('Category', Category);

