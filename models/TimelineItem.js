var sys 			= require('sys'),
	mongoose		= require('mongoose'),
	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId;

var TimelineItem = new Schema({
	title		: String,
	body		: String,
	author		: ObjectId,
	created		: Date,
	updated		: Date,
	timeline	: ObjectId
});

mongoose.model('TimelineItem', TimelineItem);

