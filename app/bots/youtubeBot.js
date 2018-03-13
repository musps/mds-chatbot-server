import envConfig from './../libraries/envConfig';
import rp from 'request-promise';

const uri = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&fields=items(id%2FvideoId%2Csnippet%2Ftitle)&key=';
const key = envConfig.YOUTUBE_KEY;
const parseResult = items => {
  const videos = [];

  for (let item of items) {
    if (typeof item.id !== 'undefined') {
      videos.push({
        'id': item.id.videoId,
        'title': item.snippet.title
      });
    }
  }
  return videos;
};

const youtubeBot = {

  // --- CONFIGURATION
  'prefix': 'youtube',
  'name': 'Youtube',

  'actions': [

    // --- CMD ABOUT
    {
      'name': '_default',
      'run': () => {
      }
    },

    // --- CMD ABOUT
    {
      'name': 'find',
      'params': [
        'query'
      ],
      'run': (app, socket, params) => {
        const opts = {
          'method': 'GET',
          'uri': uri + key + '&q=' + params.query
        };

        rp(opts)
          .then(resp => {
            const items = JSON.parse(resp).items;

            if (items.length === 0) {
              socket.emit('youtube::findError', {
                'username': youtubeBot.name,
                'message': 'No video found.'
              });
            } else {
              socket.emit('youtube::find', {
                'username': youtubeBot.name,
                'videos': parseResult(items)
              });
            }
          })
          .catch(err => {
            console.log('error youtube api');
            console.log(err);
          });
      }
    }
  ]
};

export default youtubeBot;
