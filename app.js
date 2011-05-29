// load vendor modules
var sys 			= require('sys'),
    express 		= require('./node_modules/express'),
    mongoose		= require('mongoose');

// load models
require('./models/Category.js');
require('./models/MenuItem.js');
require('./models/User.js');
require('./models/Timeline.js');
require('./models/TimelineItem.js');

// load custom modules
var core			= require('./lib/core'),
	menu			= require('./lib/menu');

// initialize other vars
var	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId,
    app 			= express.createServer();

// connect database
mongoose.connect('mongodb://localhost/timerime_reloaded');

// set template path
core.template_loader.set_path('templates');

//make static files available
app.use("/web", express.static(__dirname + '/web'));

// init controllers
require('./controllers/timeline')(app);

// add some routing
app.get('/', function(req, res){   
	core.render('homepage.html', {}, function (error, result) {
	    if (error) {
	        console.log(error);
	    } else {
	    	res.send(result);
	    }
	});
});

app.get('/about', function(req, res){
	core.render('about.html', {}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
        	res.send(result);
        }
    });
});

// listen
app.listen(3000);
