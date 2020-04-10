import { IS_SELECTED } from '../../constant';

export const initialState = {
  data: null,
  windSpeed: null,
  nestedData: [],
  topology: null,
  isLoading: false,
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
  ],
};
