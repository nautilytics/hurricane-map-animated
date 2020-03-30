import React from 'react';
import { useSelector } from 'react-redux';
import { dateAccessor, getColor, xAccessor } from '../../../../../utils';
import moment from 'moment';
import { DATE_TIME_FORMAT } from '../../../../../constant';

const WindSpeed = ({ path }) => {
  const colorScale = useSelector(state => state.global.colorScale);
  const windSpeed = useSelector(state => state.global.windSpeed);
  const timePeriods = useSelector(state => state.global.timePeriods);
  const currentIndex = useSelector(state => state.global.currentIndex);
  const dt = moment(timePeriods[currentIndex], DATE_TIME_FORMAT);

  return (
    <g className="wind-speed">
      {windSpeed
        .filter(d => moment(dateAccessor(d), DATE_TIME_FORMAT).isBefore(dt))
        .map(feature => {
          return (
            <path
              className="wind-speed"
              key={`feature-for-windspeed-${feature.properties.id}`}
              style={{ fill: getColor(xAccessor(feature), colorScale) }}
              d={path(feature)}
            />
          );
        })}
    </g>
  );
};

export default WindSpeed;
