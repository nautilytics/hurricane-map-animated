import {initialState} from '../state/global';
import {getData, getTopology, getWindSpeed} from '../api';
import {IS_CLICKED} from '../../constant';
import {getMaxDate, getMinDate, xAccessor} from '../../utils';
import {nest} from 'd3-collection';
import {scaleQuantize} from 'd3-scale';
import {schemeRdYlGn} from 'd3-scale-chromatic';
import {max} from 'd3-array';

// Actions
const TOGGLE_LOADING_ICON = 'TOGGLE_LOADING_ICON';
export const UPDATE_TOOLTIP = 'UPDATE_TOOLTIP';
export const TIMER_TICK = 'TIMER_TICK';
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
    const minDate = getMinDate(data);
    const maxDate = getMaxDate(data);
    const numberOfPeriods = maxDate.diff(minDate, 'days');
    return {
        ...state,
        data,
        nestedData: nest()
            .key(d => d.properties.startDate.format())
            .entries(data),
        numberOfPeriods,
        colorScale: scaleQuantize()
            .range(schemeRdYlGn[7].reverse())
            .domain([0, max(data, xAccessor)]),
        currentIndex: numberOfPeriods,
    };
};

const handleCurrentIndex = state => {
    if (state.currentIndex < state.numberOfPeriods) {
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
            return {
                ...state,
                windSpeed: action.windSpeed
            };
        case UPDATE_TOOLTIP:
            return {
                ...state,
                tooltip: handleTooltip(state, action.item),
            };
        case TIMER_TICK:
            return handleCurrentIndex(state);
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
    return dispatch => {
        dispatch(toggleLoadingIcon(true));

        Promise.all([getTopology(), getData(), getWindSpeed()])
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
                dispatch({type: SHOW_ERROR});
            })
            .finally(() => dispatch(toggleLoadingIcon(false)));
    };
}
