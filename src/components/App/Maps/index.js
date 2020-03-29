import React from 'react';
import {useSelector} from 'react-redux';
import {geoAlbersUsa, geoPath} from 'd3-geo';
import Map from './Map';
import * as topojson from 'topojson-client';

const Maps = () => {
    const topology = useSelector(state => state.global.topology);
    const geoJson = topojson.feature(topology, topology.objects.counties);

    const width = 975;
    const height = 610;
    const projection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
    const path = geoPath(projection);

    return (
        <div className="maps content">
            <Map width={width} height={height} geoJson={geoJson} path={path}/>
            <p className="citation">
                Data Source:{' '}
                <a className="link" href="https://www.nhc.noaa.gov/gis/" target="_blank" rel="noopener noreferrer">
                    NOAA
                </a>
            </p>
        </div>
    );
};

export default Maps;
