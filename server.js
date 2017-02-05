var express = require('express'),
    app = express();

var port = process.env.port || 1337;

app.use('/', express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=0');
})

app.get('/', function(req, res) {
    res.send('./public/index.html');
});

app.listen(port, function() {
    console.log('listening on port ' + port + '!');
});