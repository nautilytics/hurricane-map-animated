import { json } from 'd3-fetch';

export const getTopology = () => {
  return new Promise((resolve, reject) => {
    json('./data/counties-10m.json')
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
};

export const getData = selectedHurricane => {
  return new Promise((resolve, reject) => {
    json(`./data/output/${selectedHurricane.data}.json`)
      .then(response => resolve(response.features))
      .catch(err => reject(err));
  });
};

export const getWindSpeed = selectedHurricane => {
  return new Promise((resolve, reject) => {
    json(`./data/output/${selectedHurricane.windSpeed}.json`)
      .then(response => resolve(response.features))
      .catch(err => reject(err));
  });
};
