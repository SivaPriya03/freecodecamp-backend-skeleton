require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
const { isValidURL } = require('./utils');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  let { url } = req.body;
  const isWithHttp = url.indexOf('http://') === 0;
  const isWithHttps = url.indexOf('https://') === 0;
  if(isWithHttp){
    url = url.slice(7)
  }
  else if(isWithHttps){
    url = url.slice(8)
  }
  if(url[url.length - 1] === '/'){
    /* Remove / if there is any dangling slash in url */
    url = url.slice(0, -1);
  }
  isValidURL(url, (isInvalid) => {  
    if(isInvalid){
      res.json({ error: 'invalid url' });
    }
    else{
      res.json({ greeting: 'hello API' });
    }
  })
});

app.listen(8080, function () {
  console.log('Your app is listening on port 8080');
});
