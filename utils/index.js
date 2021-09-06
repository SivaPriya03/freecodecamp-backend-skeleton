const dns = require('dns');
const isValidURL = (url, callback) => {
   return dns.lookup(url, (err) => {
       const isError = err && err.code === 'ENOTFOUND';
       if(isError){
           return callback(true, null);
       }
       else{
            /* Check if machine is offline */
            dns.lookup('www.google.com', (err) => {
                if(err){
                    const webRegex = /www\.[0-9A-Za-z-\\.@:%_\+~#=]+\.[a-zA-Z0-9\.]{2,6}[?&a-zA-Z0-9-\\.@:%_\+~#=]?/;
                    const executedArr = new RegExp(webRegex).exec(url);
                    const isValid = Boolean(executedArr);
                    callback(isValid);
                }
                else{
                    callback(false);
                }
            })
       }
   })
}

module.exports = {
    isValidURL
}