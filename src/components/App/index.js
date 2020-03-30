import React, { useEffect, useCallback } from 'react';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveData } from '../../redux/modules/global';
import Map from './Map';
import Brush from './Brush';

const App = () => {
  const dispatch = useDispatch();
  const topology = useSelector(state => state.global.topology);
  const data = useSelector(state => state.global.data);
  const windSpeed = useSelector(state => state.global.windSpeed);
  const getData = useCallback(() => dispatch(retrieveData()), [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="main">
      <Tooltip />
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
