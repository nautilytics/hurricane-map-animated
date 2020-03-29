import { max, min } from 'd3-array';

export const xAccessor = d => +d.properties.radii;
export const getMaxDate = data => max(data, d => d.properties.startDate);
export const getMinDate = data => min(data, d => d.properties.startDate);
