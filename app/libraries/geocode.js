import googleMaps from '@google/maps';
import envConfig from './envConfig';

const key = envConfig.GOOGLE_GEOCODING;
const googleMapsClient = googleMaps.createClient({
  'key': key
});

export const getStringPosition = async (addr) => {
  return new Promise((resolve) => {
    googleMapsClient.geocode({
      'address': addr
    }, (err, resp) => {
      if (resp.json.status === 'ZERO_RESULTS') {
        resolve(false);
      } else {
        const res = resp.json.results;
        const geo = res[0].geometry.location;

        resolve(geo);
      }
    });
  });
};

export const getStringDoublePosition = async (start, end) => {
  const data = {
    'start': null,
    'end': null
  };

  await getStringPosition(start)
    .then(resp => {
      data.start = resp;
    });
  await getStringPosition(end)
    .then(resp => {
      data.end = resp;
    });
  return data;
};
