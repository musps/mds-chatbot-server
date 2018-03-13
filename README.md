# MDS CHAT BOT -> SERVER

# Install 

* Copy the `.env-example` file as `.env` and set the available bot api key.

# API USED

### Carrefour

URI : https://developer.fr.carrefour.io

### Uber

URI : https://developer.uber.com/

### Youtube

URI : https://developers.google.com/youtube

### Twitter

URI : https://developer.twitter.com/en/docs

### Google GeoCoding

URI : https://developers.google.com/maps/documentation/geocoding

# Create a new custom bot

* Create a new file inside `app/bots/{your_bot_name}Bot.js`

### Skeleton file

```
const yourBotNameBot = {

  'preifx': '{your_bot_prefix',

  'name': '{your_bot_name}',

  'actions': [

    // ---> Example without parameter
    {
      'name': '{your_action_name}',
      'run': (app, socket, params) => {
        // --- HERE THE RUN CODE.
      }
    },

    // ---> Example with parameter
    {
      'name': '{your_action_name}',
      'params': [
        '{your_param_1}',
        '{your_param_2}'
      ],
      'run': (app, socket, params) => {
        // --- HERE THE RUN CODE.
      }
    }
  ]
  }
}

export default yourBotNameBot;
``

* Then add your fresh bot inside the `app/app.js` file.

```
import yourBotNameBot from './bots/yourBotNameBot';

(...)

app.chat.bot.add(yourBotNameBot);

```
