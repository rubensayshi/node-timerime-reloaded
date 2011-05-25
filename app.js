var sys 			= require('sys'),
    express 		= require('./node_modules/express'),
    template_system = require('./node_modules/djangode/template/template'),
    template_loader = require('./node_modules/djangode/template/loader')
    app 			= express.createServer();

//set template path
template_loader.set_path('templates');

//context to use when rendering template. In a real app this would likely come from a database
var test_context = {
person_name: 'Thomas Hest',
company: 'Tobis A/S',
ship_date: new Date('12-02-1981'),
item: 'XXX',
item_list: [ 'Giraf', 'Fisk', 'Tapir'],
ordered_warranty: true,
ship: {
    name: 'M/S Martha',
    nationality: 'Danish'
}
};

require('./controllers/textpage')(app);

app.get('/', function(req, res){
    res.send('<h1>express + django template demo</h1> \
            <ul> \
            <li><a href="/text">The template rendered as text</a></li> \
            <li><a href="/html">The template rendered as html</a></li> \
            <li><a href="/page">page</a></li> \
            <li><a href="/pagee">page</a></li> \
            </ul> \
    ');
});

app.get('/text', function(req, res){
    template_loader.load_and_render('template.html', test_context, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.writeHeader(200, { 'Content-Type': 'text/plain;' });
        	res.write(result);
        	res.end();
        }
    });
});

app.get('/html', function(req, res){
    template_loader.load_and_render('template.html', test_context, function (error, result) {
        if (error) {
            console.log(error);
        } else {
        	res.send(result);
        }
    });
});

app.listen(3000);
