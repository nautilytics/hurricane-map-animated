import {json} from 'd3-fetch';

export const getTopology = () => {
    return new Promise((resolve, reject) => {
        json('./data/counties-10m.json')
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};

export const getData = () => {
    return new Promise((resolve, reject) => {
        json('./data/output/hurricane-sandy-affected-counties-over-time.json')
            .then(response => resolve(response.features))
            .catch(err => reject(err));
    });
};

export const getWindSpeed = () => {
    return new Promise((resolve, reject) => {
        json('./data/output/al182012_radii.json')
            .then(response => resolve(response.features))
            .catch(err => reject(err));
    });
};
