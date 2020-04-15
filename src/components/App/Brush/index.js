import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from '@material-ui/core';
import moment from 'moment';
import { DATE_TIME_FORMAT, DISPLAY_DATE_FORMAT, DURATION } from '../../../constant';
import { TIMER_TICK, UPDATE_CURRENT_INDEX } from '../../../redux/modules/global';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import './index.scss';

const Brush = () => {
  const dispatch = useDispatch();
  const timePeriods = useSelector(state => state.global.timePeriods);
  const currentIndex = useSelector(state => state.global.currentIndex);
  const [localValue, setLocalValue] = useState(currentIndex);
  const tickTimer = useCallback(() => dispatch({ type: TIMER_TICK }), [dispatch]);
  const minValue = moment(timePeriods[0], DATE_TIME_FORMAT);
  const maxValue = moment(timePeriods[timePeriods.length - 1], DATE_TIME_FORMAT);
  const [timer, setTimer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setLocalValue(currentIndex);
  }, [currentIndex]);

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

  const updateOnDrag = (evt, newValue) => {
    setLocalValue(marks.findIndex(d => d.value === newValue));
  };

  const start = () => {
    setTimer(
      setInterval(() => {
        tickTimer();
      }, DURATION),
    );
    setIsPlaying(true);
    tickTimer();
  };
  const stop = () => {
    setIsPlaying(false);
    setTimer(clearInterval(timer));
  };

  return (
    <div id="brush">
      {isPlaying ? <PauseCircleOutline fontSize={'large'} onClick={stop} /> : <PlayCircleOutline fontSize={'large'} onClick={start} />}
      <div className="label">{minValue.format('MMM DD')}</div>
      <Slider
        value={moment(timePeriods[localValue], DATE_TIME_FORMAT).valueOf()}
        onChangeCommitted={updateCurrentIndexOnDragEnd}
        onChange={updateOnDrag}
        valueLabelDisplay="on"
        valueLabelFormat={x => moment(x).format(DISPLAY_DATE_FORMAT)}
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
