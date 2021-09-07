require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
const { isValidURL } = require('./utils');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { URL } = require('./database/models/index.js');
const { URL_CONSTANTS } = require('./constants');
const e = require('express');

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
app.post(URL_CONSTANTS.SHORT_URL_PREFIX, function(req, res) {
  let { url: originalURL } = req.body;
  let url = originalURL;
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
      const url = new URL({ originalURL });
      url.save((error, data) => {
        if(error){
          console.log(error);
          res.json({ error: 'Some error occurred'})
        }
        else{
          const { originalURL, shortid } = data;
          res.json({ original_url: originalURL, short_url: shortid });
        }
      })
    }
  })
});

app.get(`${URL_CONSTANTS.SHORT_URL_PREFIX}/:shortid`, (req, res) => {
  const { shortid } = req.params;
  URL.findOne({ shortid: Number(shortid) })
    .select('originalURL')
    .then(data => {
      const { originalURL } = data;
      res.redirect(originalURL);
    })
    .catch(err => {
      console.log(err);
      res.json({"error":"No short URL found for the given input"});
    })
})

app.listen(8080, function () {
  console.log('Your app is listening on port 8080');
});
