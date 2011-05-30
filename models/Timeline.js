var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var Timeline = new Schema({
	title		: String,
	slug		: String,
	body		: String,
	author		: ObjectId,
	categories	: [ObjectId],
	coauthors	: [ObjectId],
	created		: Date,
	updated		: Date
});

mongoose.model('Timeline', Timeline);

