const key = 'gAOTsRsPCnSkJWagk4nSw';
const secret = 'x2Tx2PI3iLqW9OnIVCkuIaCVXdV9KQhxobwrKJCck';


var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: key,
  consumer_secret: secret,
  access_token_key: '',
  access_token_secret: ''
});
 
var params = {screen_name: 'francejijojoijioinfo'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets[0].text);
  } else {
    console.log(error);
  }
});