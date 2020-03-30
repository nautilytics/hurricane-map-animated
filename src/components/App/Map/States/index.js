import React from 'react';
import { useSelector } from 'react-redux';
import * as topojson from 'topojson-client';

const States = ({ path }) => {
  const topology = useSelector(state => state.global.topology);

  return (
    <path
      className="state"
      d={path(
        topojson.mesh(topology, topology.objects.states, function(a, b) {
          return a !== b;
        }),
      )}
    />
  );
};

export default States;
