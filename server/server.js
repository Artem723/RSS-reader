'use strict';
let app = ( require('express') )();
let parser = require('rss-parser');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let apiRoute = require('./routes/apiRoute');

let reqParser = bodyParser.json();
/* 
parser.parseURL('http://news.tut.by/rss/index.rss', function(err, parsed) {
  console.log(parsed.feed.title + '\n');
 // console.log(parsed);
  console.log(parsed.feed.entries[0]);
//   parsed.feed.entries.forEach(function(entry) {
//     console.log(entry);
//   });
});*/


app.use(cors);
app.use(reqParser);
//app.use(logger);
app.use(morgan('dev'));
//console.log(apiRoute);
app.use('/api', apiRoute);
app.post('/getRSS', function (req, res) {
  //bottleneck !!! парсится JSON данные до того как проверили заголовок Content-Type
  // console.log(typeof req.body);
  // console.log(req.body);
  let body = req.body;
  //let body = JSON.parse(req.body);
  if (body.feedURL && req.get('Content-Type') === 'application/json') {
  
    parser.parseURL(body.feedURL, function (err, parsed) {
      if(err){
        res.status(400);
        res.json(err);
      }
      else res.json(parsed.feed);

      res.end();
    });
  }
 else res.status(400).json({message: "Invalid request: url is " +  body.feedURL + "; content-type is" + req.get('Content-Type')}).end();

});




// function logger(req, res, next) {
//   console.log('Request!');
//   console.log('method: ' + req.method);
//   console.log('path: ' + req.path);
//   console.log('body: ');
//   console.log(req.body);
//   console.log("---------------------------");
//   next();

// }
function cors(req, res, next) {
  let origin = req.get('Origin');
  if(origin) res.append('Access-Control-Allow-Origin' , origin);
  if(req.get('Access-Control-Request-Headers') === 'content-type') {
    res.append('Access-Control-Allow-Headers', 'content-type');
    res.status(200).end();
  }
  else 
    next();
}

app.listen(8000, function() {
    console.log("server has been started");
})