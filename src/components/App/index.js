import React, { useEffect, useCallback, useState } from 'react';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import Maps from './Maps';
import { retrieveData, TIMER_TICK } from '../../redux/modules/global';
import { DURATION } from '../../constant';

const App = () => {
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const topology = useSelector(state => state.global.topology);
  const data = useSelector(state => state.global.data);
  const windSpeed = useSelector(state => state.global.windSpeed);
  const getData = useCallback(() => dispatch(retrieveData()), [dispatch]);
  const tickTimer = useCallback(() => dispatch({ type: TIMER_TICK }), [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  const icon = isPlaying ? faPause : faPlay;

  const start = () => {
    setTimer(setInterval(() => tickTimer(), DURATION));
    setIsPlaying(true);
    tickTimer();
  };
  const stop = () => {
    setIsPlaying(false);
    setTimer(clearInterval(timer));
  };

  return (
    <div className="main">
      <Tooltip isPlaying={isPlaying} />
      <FontAwesomeIcon
        size="lg"
        className={`${isPlaying} ? 'pause' : 'play'} button`}
        icon={icon}
        onClick={() => {
          isPlaying ? stop() : start();
        }}
      />
      {topology && data && windSpeed ? <Maps /> : <Spinner />}
    </div>
  );
};

export default App;
