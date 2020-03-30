import React from 'react';
import { useSelector } from 'react-redux';
import Path from './Path';
import { getColor, xAccessor } from '../../../../utils';
import mostRecentDataSelector from '../../../../redux/selectors/most.recent.data.selector';
import moment from 'moment';
import QuantizeLegend from './QuantizeLegend';
import { DATE_TIME_FORMAT } from '../../../../constant';
import { max } from 'd3-array';
import WindSpeed from './WindSpeed';
import States from './States';

const Map = ({ path, geoJson, width, height }) => {
  const colorScale = useSelector(state => state.global.colorScale);
  const timePeriods = useSelector(state => state.global.timePeriods);
  const currentIndex = useSelector(state => state.global.currentIndex);
  const data = useSelector(mostRecentDataSelector);
  const dt = moment(timePeriods[currentIndex], DATE_TIME_FORMAT);

  return (
    <div className="map">
      <h3>Hurricane Sandy</h3>
      <h5>{`at ${dt.format('MMM DD, YYYY hh:mm a')}`}</h5>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        <QuantizeLegend width={width} />
        <g className="map-container">
          <WindSpeed path={path} />
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
                  fill: !value ? 'white' : getColor(value, colorScale),
                }}
              />
            );
          })}
          <States path={path} />
        </g>
      </svg>
    </div>
  );
};

export default Map;
