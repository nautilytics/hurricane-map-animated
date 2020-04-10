import { IS_SELECTED } from '../../constant';

export const initialState = {
  data: null,
  windSpeed: null,
  nestedData: [],
  topology: null,
  isLoading: true,
  showError: false,
  tooltip: null,
  currentIndex: 0,
  timePeriods: [],
  colorScale: null,
  hurricanes: [
    {
      name: 'Hurricane Sandy',
      id: 'al182012',
      windSpeed: 'al182012_radii',
      data: 'hurricane-sandy-affected-counties-over-time',
      [IS_SELECTED]: true,
    },
    {
      name: 'Hurricane Katrina',
      id: 'al122005',
      windSpeed: 'al122005_radii',
      data: 'hurricane-katrina-affected-counties-over-time',
      [IS_SELECTED]: false,
    },
  ],
};
