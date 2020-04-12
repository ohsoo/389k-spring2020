var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var dataUtil = require("./data-util");
var _ = require("underscore");
var logger = require('morgan');
var exphbs = require('express-handlebars');
var handlebars = exphbs.handlebars;
var moment = require('moment');
var app = express();
var PORT = 3000;

var _DATA = dataUtil.loadData().listings;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

app.get('/',function(req,res){
  res.render('home',{
  		data: _DATA
  });
});

app.get("/newlisting", function(req, res) {
    res.render('create');
});

var id = 0
app.post('/api/newlisting', function(req, res) {
    if(!req.body) { return res.send("No data recieved"); }
    var body = req.body;

    // Set unique ID
    body.id = (++id).toString()

    // Transform price
    body.price = parseInt(body.price)

    // Add time
    body.time = moment().format('MM/D/YY, HH:mm');

    // Save new blog post
    _DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/");
});

app.get('/listing/:id', function(req, res) {
    var _id = req.params.id.toString();    // from request parameters
    console.log(_id)
    console.log()
    var listing = _.findWhere(_DATA, { id: _id });    // find all posts w/ slug tag
    if (!listing) return res.render('404');
    res.render('listing', listing);
});

app.get('/api/getlistings', function(req, res) {
    res.end(JSON.stringify(_DATA));
});

app.get('/type/:type', function(req, res) {
    var type = req.params.type;
    var listings = [];
    _DATA.forEach(function(listing) {
        if (listing.type == type) {
            listings.push(listing);
        }
    });
    res.render('home', {
        type: type,
        data: listings,
    });
});

app.get('/alphabetical', function(req, res) {
    var sorted = JSON.parse(JSON.stringify(_DATA))
    sorted = dataUtil.getAlphabetical(sorted)
    res.render('home', {
        data: sorted,
        alphabetical: true
    });
});

app.listen(PORT, function() {
    console.log('Listening on port 3000!');
});
