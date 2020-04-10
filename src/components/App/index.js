import React, { useEffect, useCallback } from 'react';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveData, updateHurricane } from '../../redux/modules/global';
import Map from './Map';
import Brush from './Brush';
import MaterialSelect from './MaterialSelect';

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.global.isLoading);
  const hurricanes = useSelector(state => state.global.hurricanes);
  const getData = useCallback(() => dispatch(retrieveData()), [dispatch]);
  const updateSelectedHurricane = useCallback(id => dispatch(updateHurricane(id)), [dispatch]);

  useEffect(() => {
    getData();
  }, []);

  const onChange = id => {
    // When a user changes the selected hurricane, retrieve the new data set
    updateSelectedHurricane(id);
  };

  return (
    <div className="main">
      <Tooltip />
      <MaterialSelect items={hurricanes} label={'Select a hurricane'} handleChange={onChange} />
      {!isLoading ? (
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
