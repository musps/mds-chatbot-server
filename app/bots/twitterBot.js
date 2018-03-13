import envConfig from './../libraries/envConfig';
import Twitter from 'twitter';

const client = new Twitter({
  'consumer_key': envConfig.TWITTER_CONSUMER_KEY,
  'consumer_secret': envConfig.TWITTER_CONSUMER_SECRET,
  'access_token_key': '',
  'access_token_secret': ''
});

const twitterBot = {

  // --- CONFIGURATION
  'prefix': 'twitter',
  'name': 'Twitter',

  'actions': [

    // --- CMD ABOUT
    {
      'name': '_default',
      'run': () => {
      }
    },

    // --- LAST TWITTER
    {
      'name': 'lasttweet',
      'params': [
        'name'
      ],
      'run': (app, socket, params) => {
        const reqParams = {
          'screen_name': params.name
        };

        client.get('statuses/user_timeline', reqParams, (err, tweets) => {
          if (err) {
            socket.emit('twitter::lasttweetError', 'user not found');
          } else {
            const output = {
              'name': tweets[0].user.name,
              'tweet': tweets[0].text
            };

            socket.emit('twitter::lasttweet', output);
          }
        });
      }
    }

  ]

};

export default twitterBot;
