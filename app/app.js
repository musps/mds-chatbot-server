import http from 'http';
import socketio from './libraries/socketio';
import Users from './libraries/users';
import Chat from './libraries/chat';
import {getStringPosition, getStringDoublePosition} from './libraries/geocode';
import {app as log} from './libraries/debug';
import envConfig from './libraries/envConfig';
import systemBot from './bots/systemBot';
import uberBot from './bots/uberBot';
import youtubeBot from './bots/youtubeBot';
import carrefourBot from './bots/carrefourBot';
import twitterBot from './bots/twitterBot';

const app = {
  'port': 8091,
  'envConfig': envConfig,
  'users': new Users(),
  'chat': new Chat(),
  'servers': null,
  'tools': {
    'getStringPosition': getStringPosition,
    'getStringDoublePosition': getStringDoublePosition
  }
};

app.chat.bot.add(systemBot);

// ---> UBER BOT
if (typeof envConfig.UBER_BEARER === 'undefined' || envConfig.UBER_BEARER === '') {
  log('Erreur uber bot config');
} else {
  app.chat.bot.add(uberBot);
}
// ---> YOUTUBE BOT
if (typeof envConfig.YOUTUBE_KEY === 'undefined' || envConfig.YOUTUBE_KEY === '') {
  log('Erreur youtube bot config');
} else {
  app.chat.bot.add(youtubeBot);
}
// ---> CARREFOUR BOT
if (typeof envConfig.CARREFOUR_SECRET === 'undefined' || typeof envConfig.CARREFOUR_ID === 'undefined'
  || envConfig.CARREFOUR_SECRET === '' || envConfig.CARREFOUR_ID === '') {
  log('Erreur carrefour bot config');
} else {
  app.chat.bot.add(carrefourBot);
}
// ---> TWITTER BOT
if (typeof envConfig.TWITTER_CONSUMER_KEY === 'undefined' || typeof envConfig.TWITTER_CONSUMER_SECRET === 'undefined'
  || envConfig.TWITTER_CONSUMER_KEY === '' || envConfig.TWITTER_CONSUMER_SECRET === '') {
  log('Erreur carrefour bot config');
} else {
  app.chat.bot.add(twitterBot);
}

app.server = http.createServer(() => {
});

socketio.run(app);

app.server.listen(app.port, () => {
  console.log('server up');
});
