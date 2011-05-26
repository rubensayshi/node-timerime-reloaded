var sys 			= require('sys'),
    express 		= require('./node_modules/express'),
    template_system = require('./node_modules/djangode/template/template'),
    template_loader = require('./node_modules/djangode/template/loader')
    app 			= express.createServer();

//set template path
template_loader.set_path('templates');

// make static files available
app.use("/web", express.static(__dirname + '/web'));

// require controllers
require('./controllers/textpage')(app);

// add some more routing
app.get('/', function(req, res){    
	template_loader.load_and_render('homepage.html', {}, function (error, result) {
	    if (error) {
	        console.log(error);
	    } else {
	    	res.send(result);
	    }
	});
});

app.get('/about', function(req, res){
    template_loader.load_and_render('about.html', {}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
        	res.send(result);
        }
    });
});

// listen
app.listen(3000);
