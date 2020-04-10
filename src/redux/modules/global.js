import { initialState } from '../state/global';
import { getData, getTopology, getWindSpeed } from '../api';
import { IS_CLICKED, IS_SELECTED } from '../../constant';
import { dateAccessor } from '../../utils';
import { nest } from 'd3-collection';
import { scaleQuantile } from 'd3-scale';
import { schemeYlOrRd } from 'd3-scale-chromatic';
import { ascending } from 'd3-array';

// Actions
const TOGGLE_LOADING_ICON = 'TOGGLE_LOADING_ICON';
export const UPDATE_TOOLTIP = 'UPDATE_TOOLTIP';
export const TIMER_TICK = 'TIMER_TICK';
export const UPDATE_CURRENT_INDEX = 'UPDATE_CURRENT_INDEX';
const UPDATE_DATA = 'UPDATE_DATA';
const UPDATE_TOPOLOGY = 'UPDATE_TOPOLOGY';
const SHOW_ERROR = 'SHOW_ERROR';
const UPDATE_WIND_SPEED = 'UPDATE_WIND_SPEED';

const handleTooltip = (state, item) => {
  if (state.tooltip && state.tooltip[IS_CLICKED]) {
    if (item && item[IS_CLICKED]) {
      if (item.id === state.tooltip.id) {
        return null;
      } else {
        return item;
      }
    } else {
      return state.tooltip;
    }
  } else {
    return item;
  }
};

const handleCountyLevelData = (state, data) => {
  return {
    ...state,
    data,
    nestedData: nest()
      .key(dateAccessor)
      .entries(data),
    colorScale: scaleQuantile()
      .range(schemeYlOrRd[3])
      .domain([0, 34, 50, 64]),
  };
};

const handleCurrentIndex = state => {
  if (state.currentIndex < state.timePeriods.length - 1) {
    return {
      ...state,
      currentIndex: state.currentIndex + 1,
    };
  } else {
    return {
      ...state,
      currentIndex: 0,
    };
  }
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_DATA:
      return handleCountyLevelData(state, action.data);
    case UPDATE_TOPOLOGY:
      return {
        ...state,
        topology: action.topology,
      };
    case UPDATE_WIND_SPEED:
      const timePeriods = Array.from(new Set(action.windSpeed.map(dateAccessor))).sort(ascending);
      return {
        ...state,
        timePeriods,
        windSpeed: action.windSpeed,
        currentIndex: timePeriods.length - 1,
      };
    case UPDATE_TOOLTIP:
      return {
        ...state,
        tooltip: handleTooltip(state, action.item),
      };
    case TIMER_TICK:
      return handleCurrentIndex(state);
    case UPDATE_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: action.value,
      };
    case SHOW_ERROR:
      return {
        ...state,
        showError: true,
      };
    case TOGGLE_LOADING_ICON:
      return {
        ...state,
        showError: false,
        isLoading: action.x,
      };
    default:
      return state;
  }
}

function toggleLoadingIcon(x) {
  return {
    type: TOGGLE_LOADING_ICON,
    x,
  };
}

export function retrieveData() {
  return (dispatch, getState) => {
    dispatch(toggleLoadingIcon(true));

    // Get the currently selected hurricane
    const selectedHurricane = getState().global.hurricanes.find(hurricane => hurricane[IS_SELECTED]);

    Promise.all([getTopology(), getData(selectedHurricane), getWindSpeed(selectedHurricane)])
      .then(results => {
        const [topology, data, windSpeed] = results;
        dispatch({
          type: UPDATE_TOPOLOGY,
          topology,
        });
        dispatch({
          type: UPDATE_DATA,
          data,
        });
        dispatch({
          type: UPDATE_WIND_SPEED,
          windSpeed,
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: SHOW_ERROR });
      })
      .finally(() => dispatch(toggleLoadingIcon(false)));
  };
}
