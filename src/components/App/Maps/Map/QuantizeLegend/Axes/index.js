import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { axisBottom } from 'd3-axis';
import './index.scss';

const Axes = ({ xScale, colorScale, xScaleTickFormat, height }) => {
  const xAxisRef = useRef(null);

  useEffect(() => {
    renderAxes();
  });

  const renderAxes = () => {
    renderXAxis();
  };

  const renderXAxis = () => {
    const xAxis = select(xAxisRef.current);

    // Ensure all ending tick values are included in the legend
    const tickValues = colorScale
      .range()
      .map(d => colorScale.invertExtent(d)[1])
      .concat(colorScale.invertExtent(colorScale.range()[colorScale.range().length - 1])[1]);

    xAxis.call(
      axisBottom(xScale)
        .tickFormat(xScaleTickFormat)
        .tickValues(tickValues),
    );

    xAxis.call(g => g.select('.domain').remove());
    xAxis.call(g => g.selectAll('.tick line').remove());
  };

  return (
    <g className="axis">
      <g className="x--axis" transform={`translate(0,${height})`} ref={xAxisRef} />
    </g>
  );
};

const defaultProps = {
  xScale: null,
  colorScale: null,
  height: 0,
  xScaleTickFormat: null,
};

Axes.defaultProps = defaultProps;

export default Axes;
