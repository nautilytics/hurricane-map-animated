import React from 'react';
import {useSelector} from 'react-redux';
import * as topojson from 'topojson-client';
import Path from './Path';
import {dateAccessor, xAccessor} from '../../../../utils';
import mostRecentDataSelector from '../../../../redux/selectors/most.recent.data.selector';
import moment from 'moment';
import QuantizeLegend from "./QuantizeLegend";
import {DATE_TIME_FORMAT} from "../../../../constant";
import {max} from "d3-array";

const Map = ({path, geoJson, width, height}) => {
    const topology = useSelector(state => state.global.topology);
    const colorScale = useSelector(state => state.global.colorScale);
    const windSpeed = useSelector(state => state.global.windSpeed);
    const timePeriods = useSelector(state => state.global.timePeriods);
    const currentIndex = useSelector(state => state.global.currentIndex);
    const data = useSelector(mostRecentDataSelector);
    const dt = moment(timePeriods[currentIndex], DATE_TIME_FORMAT);

    return (
        <div className="map">
            <h3>Hurricane Sandy</h3>
            <h5>{`at ${dt.format('MMM DD, YYYY hh:mm a')}`}</h5>
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
                <QuantizeLegend width={width}/>
                <g className="map-container">
                    {geoJson.features.map(feature => {
                        const id = feature.id.toString().padStart(5, '0');
                        const matchingRow = data.filter(x => x.properties.fips === id);

                        let value = 0;
                        if (matchingRow.length) {
                            // Get the maximum radii for all the matching shapes
                            value = max(matchingRow, xAccessor);
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
                        windSpeed
                            .filter(d => moment(dateAccessor(d), DATE_TIME_FORMAT).isBefore(dt))
                            .map(feature => {
                                return (
                                    <path className="wind-speed" key={`feature-for-windspeed-${feature.properties.id}`}
                                          style={{fill: colorScale(xAccessor(feature))}}
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
