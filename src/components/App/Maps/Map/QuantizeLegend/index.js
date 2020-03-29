import Axes from './Axes';
import {NUMBER_FORMAT} from '../../../../../constant';
import React from 'react';
import {extent} from "d3-array";
import {useSelector} from "react-redux";
import {scaleLinear} from "d3-scale";

const QuantizeLegend = ({width}) => {
    const colorScale = useSelector(state => state.global.colorScale);

    const xScale = scaleLinear()
        .domain(extent(colorScale.domain()))
        .rangeRound([0, 260]);

    return (
        <g className="legend" transform={`translate(${width - 280},${20})`}>
            {colorScale
                .range()
                .map(d => colorScale.invertExtent(d))
                .map((d, i) => {
                    const [start, end] = d;
                    return (
                        <rect key={`legend-rect-${i}`} height={8} x={xScale(start)} width={xScale(end) - xScale(start)}
                              fill={colorScale(start)}/>
                    );
                })}
            <text className="title" x={xScale.range()[0]} y={-6}>
                Hurricane Sandy Wind Speeds
            </text>
            <Axes colorScale={colorScale} xScale={xScale} xTickFormat={NUMBER_FORMAT}/>
        </g>
    );
};

export default QuantizeLegend;
