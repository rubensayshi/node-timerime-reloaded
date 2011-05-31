// load vendor modules
var sys 			= require('sys'),
    express 		= require('./node_modules/express'),
    mongoose		= require('mongoose');

// load models
require('./models/Category');
require('./models/MenuItem');
require('./models/User');
require('./models/Timeline');
require('./models/TimelineItem');

// load custom modules
var core			= require('./lib/core'),
	menu			= require('./lib/menu');

// initialize other vars
var	Schema 			= mongoose.Schema,
	ObjectId		= Schema.ObjectId,
    app 			= express.createServer();

// connect database
mongoose.connect('mongodb://localhost/timerime-reloaded');

// set template path
core.template_loader.set_path('templates');

//make static files available
app.use("/web", express.static(__dirname + '/web'));

// init controllers
require('./controllers/timeline')(app);

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
