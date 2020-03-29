import React from 'react';
import {useSelector} from 'react-redux';
import * as topojson from 'topojson-client';
import Path from './Path';
import {xAccessor} from '../../../../utils';
import mostRecentDataSelector from '../../../../redux/selectors/most.recent.data.selector';
import moment from 'moment';
import QuantizeLegend from "./QuantizeLegend";

const Map = ({path, geoJson, width, height}) => {
    const topology = useSelector(state => state.global.topology);
    const colorScale = useSelector(state => state.global.colorScale);
    const windSpeed = useSelector(state => state.global.windSpeed);
    const data = useSelector(mostRecentDataSelector);
    const dt = moment(data.key);

    return (
        <div className="map">
            <h3>Hurricane Sandy</h3>
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
                <QuantizeLegend width={width}/>
                <g className="map-container">
                    {geoJson.features.map(feature => {
                        const id = feature.id.toString().padStart(5, '0');
                        const matchingRow = data.values.find(x => x.properties.fips === id);

                        let value = 0;
                        if (matchingRow) {
                            value = xAccessor(matchingRow);
                        }

                        return (
                            <Path
                                key={`feature-for-${id}`}
                                className={!value ? 'no-data' : ''}
                                feature={{
                                    ...feature,
                                    id,
                                    path: path(feature),
                                    dt,
                                    value,
                                    fill: !value ? 'white' : colorScale(value),
                                }}
                            />
                        );
                    })}
                    <path
                        className="state"
                        d={path(
                            topojson.mesh(topology, topology.objects.states, function (a, b) {
                                return a !== b;
                            }),
                        )}
                    />
                    {
                        windSpeed.map(feature => {
                            return (
                                <path className="wind-speed" key={`feature-for-windspeed-${feature.properties.id}`}
                                      d={path(feature)}/>
                            )
                        })
                    }
                </g>
            </svg>
        </div>
    );
};

export default Map;
