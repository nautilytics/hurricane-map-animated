import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from '@material-ui/core';
import moment from 'moment';
import { DATE_TIME_FORMAT, DISPLAY_DATE_FORMAT } from '../../../constant';
import { UPDATE_CURRENT_INDEX } from '../../../redux/modules/global';
import './index.scss';

const Brush = () => {
  const dispatch = useDispatch();
  const timePeriods = useSelector(state => state.global.timePeriods);
  const [value, setValue] = useState(moment(timePeriods[timePeriods.length - 1], DATE_TIME_FORMAT).valueOf());
  const minValue = moment(timePeriods[0], DATE_TIME_FORMAT);
  const maxValue = moment(timePeriods[timePeriods.length - 1], DATE_TIME_FORMAT);

  const updateRange = (evt, newValue) => setValue(newValue);

  const marks = timePeriods.map(timePeriod => {
    return {
      value: moment(timePeriod, DATE_TIME_FORMAT).valueOf(),
      label: moment(timePeriod, DATE_TIME_FORMAT).format(DISPLAY_DATE_FORMAT),
    };
  });

  const updateCurrentIndexOnDragEnd = useCallback(
    (evt, newValue) => {
      const idx = marks.findIndex(d => d.value === newValue);
      dispatch({
        type: UPDATE_CURRENT_INDEX,
        value: idx,
      });
    },
    [dispatch],
  );

  return (
    <div id="brush">
      <div className="label">{minValue.format('MMM DD')}</div>
      <Slider
        value={value}
        onChange={updateRange}
        onChangeCommitted={updateCurrentIndexOnDragEnd}
        valueLabelDisplay="auto"
        valueLabelFormat={value => ''}
        getAriaValueText={() => ''}
        aria-labelledby="discrete-slider-restrict"
        min={minValue.valueOf()}
        max={maxValue.valueOf()}
        step={null}
        marks={marks}
      />
      <div className="label">{maxValue.format('MMM DD')}</div>
    </div>
  );
};
export default Brush;
