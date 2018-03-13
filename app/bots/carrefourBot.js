import envConfig from './../libraries/envConfig';
import rp from 'request-promise';

const uri = 'https://api.fr.carrefour.io/v1/openapi/stores';
const secret = envConfig.CARREFOUR_SECRET;
const id = envConfig.CARREFOUR_ID;

const carrefourBot = {

  // --- CONFIGURATION
  'prefix': 'carrefour',
  'name': 'Carrefour',

  'actions': [

    // --- CMD ABOUT
    {
      'name': '_default',
      'run': () => {
      }
    },

    {
      'name': 'stores',
      'run': (app, socket) => {
        socket.emit('carrefour::askCoords');
      }
    },

    // --- CMD ABOUT
    {
      'name': 'find',
      'params': [
        'longitude',
        'latitude'
      ],
      'run': (app, socket, params) => {
        const opts = {
          'uri': uri,
          'qs': {
            'longitude': params.longitude,
            'latitude': params.latitude,
            'radius': 10000
          },
          'headers': {
            'accept': 'application/json',
            'x-ibm-client-secret': secret,
            'x-ibm-client-id': id
          }
        };

        rp(opts)
          .then(res => {
            if (res === '') {
              socket.emit('carrefour::findError', {
                'message': 'No result'
              });
            } else {
              let data = JSON.parse(res);

              data.start_longitude = params.longitude;
              data.start_latitude = params.latitude;
              socket.emit('carrefour::find', data);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  ]
};

export default carrefourBot;
