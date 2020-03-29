import {json} from 'd3-fetch';
import moment from 'moment';

export const getTopology = () => {
    return new Promise((resolve, reject) => {
        json('./data/counties-10m.json')
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};

export const getData = () => {
    return new Promise((resolve, reject) => {
        json('./data/output/hurricane-sandy-affected-counties.json')
            .then(response => {
                    resolve(
                        response.features.map(d => {
                            return {
                                ...d,
                                properties: {
                                    ...d.properties,
                                    startDate: moment(d.properties.startdtg, 'YYYYMMDDHH'),
                                    endDate: moment(d.properties.enddtg, 'YYYYMMDDHH'),
                                }
                            };
                        }),
                    )
                }
            )
            .catch(err => reject(err));
    });
};

export const getWindSpeed = () => {
    return new Promise((resolve, reject) => {
        json('./data/output/al182012_windswath.json')
            .then(response =>
                resolve(
                    response.features.map(d => {
                        return {
                            ...d,
                            properties: {
                                ...d.properties,
                                startDate: moment(d.properties.startdtg, 'YYYYMMDDHH'),
                                endDate: moment(d.properties.enddtg, 'YYYYMMDDHH'),
                            }
                        };
                    }),
                ),
            )
            .catch(err => reject(err));
    });
};
