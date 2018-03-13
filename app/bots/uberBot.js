import envConfig from './../libraries/envConfig';
import rp from 'request-promise';

const uberBotBearer = envConfig.UBER_BEARER;
const uri = 'https://api.uber.com/v1.2/requests/estimate';
const mileToKm = 1.60934;
const secondsToHms = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour ' : ' hours ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second ' : ' seconds ') : '';

  return (hDisplay + mDisplay + sDisplay).trim();
};

const uberBot = {

  // --- CONFIGURATION
  'prefix': 'uber',
  'name': 'Uber',

  // --- ACTIONS
  'actions': [

    // --- CMD ABOUT
    {
      'name': '_default',
      'run': () => {
        console.log('bot uber command default');
      }
    },

    // --- CMD ESTIMATE
    {
      'name': 'estimate',
      'params': [
        'start',
        'end'
      ],
      'run': (app, socket, params) => {
        app.tools.getStringDoublePosition(params.start, params.end)
          .then(resp => {
            if (resp.start === false || resp.end === false) {
              socket.emit('uber::estimateError', {
                'username': uberBot.name,
                'message': 'Destination not found, try again please.'
              });
            } else {
              console.log(resp);

              const body = {
                'start_latitude': resp.start.lat,
                'start_longitude': resp.start.lng,
                'end_latitude': resp.end.lat,
                'end_longitude': resp.end.lng
              };
              const opts = {
                'method': 'POST',
                'uri': uri,
                'auth': {
                  'bearer': uberBotBearer
                },
                'json': true,
                'body': body
              };

              rp(opts)
                .then(resp => {
                  const data = {
                    'coords': body,
                    'price': resp.fare.display.replace('€', ''),
                    'distance': parseFloat(resp.trip.distance_estimate * mileToKm).toFixed(2),
                    'duration': secondsToHms(resp.trip.duration_estimate)
                  };

                  socket.emit('uber::estimate', {
                    'from': {
                      'name': uberBot.name
                    },
                    'params': data
                  });
                })
                .catch(err => {
                  socket.emit('uber::estimateError', {
                    'username': uberBot.name,
                    'message': err.response.body.message
                  });
                });
            }
          });
      }
    }
    // --- .\ CMD ESTIMATE

  ]
};

export default uberBot;
