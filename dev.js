// load vendor modules
var sys 			= require('sys'),
    mongoose		= require('mongoose');

// load models
require('./models/Category.js');
require('./models/MenuItem.js');
require('./models/User.js');
require('./models/Timeline.js');
require('./models/TimelineItem.js');

// connect database
mongoose.connect('mongodb://localhost/timerime_reloaded');

Category		= mongoose.model('Category');
User			= mongoose.model('User');
Timeline		= mongoose.model('Timeline');
TimelineItem 	= mongoose.model('TimelineItem');

for (var c = 0; c < 15; c++) {
	cat = new Category();
	cat.title = 'Category #'+c;
	
	for (var u = 0; u < 20; u++) {
		user = new User();
		user.username = 'User #'+c+' #'+u;
		
		for (var t = 0; t < 20; t++) {
			timeline = new Timeline();
			timeline.title = 'Timeline #'+c+' #'+u+' #'+t;
			
			for (var i = 0; i < 20; i++) {
				item = new TimelineItem();
				item.title = 'TimelineItem #'+c+' #'+u+' #'+t+' #'+i;
				
				item.save();
			}
			
			timeline.save();
		}
		
		user.save();
	}
	
	cat.save();
}
