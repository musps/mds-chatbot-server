import googleMaps from '@google/maps';

const key = 'AIzaSyDkvcu_3ELN9yoBpe_hJllgPA2AmAfFw8k';
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
