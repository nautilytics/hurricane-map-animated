export const xAccessor = d => +d.properties.radii;
export const idAccessor = d => d.properties.id;
export const dateAccessor = d => d.properties.synoptime;
export const getColor = (d, colorScale) => {
  switch (d) {
    case 34:
      return colorScale.range()[0];
    case 50:
      return colorScale.range()[1];
    case 64:
      return colorScale.range()[2];
    default:
      return 'white';
  }
};
