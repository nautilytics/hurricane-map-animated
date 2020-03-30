import React, { useEffect, useCallback, useState } from 'react';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveData, TIMER_TICK } from '../../redux/modules/global';
import { DURATION } from '../../constant';
import Map from './Map';
import Brush from './Brush';

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
    <div className="main">
      <Tooltip isPlaying={isPlaying} />
      <h3>Hurricane Sandy</h3>
      {topology && data && windSpeed ? (
        <>
          <Map />
          <div className="footer">
            <p className="citation">
              Data Source:{' '}
              <a className="link" href="https://www.nhc.noaa.gov/gis/" target="_blank" rel="noopener noreferrer">
                NOAA
              </a>
            </p>
            <Brush />
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default App;
