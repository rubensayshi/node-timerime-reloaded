var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var Timeline = new Schema({
	title		: String,
	body		: String,
	author		: ObjectId,
	coauthors	: [ObjectId],
	created		: Date,
	updated		: Date
});

mongoose.model('Timeline', Timeline);

