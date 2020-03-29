import {createSelector} from 'reselect';

const nestedDataSelector = state => state.global.nestedData;
const currentIndexSelector = state => state.global.currentIndex;
const timePeriodsSelector = state => state.global.timePeriods;

const mostRecentDataSelector = createSelector(
    [nestedDataSelector, currentIndexSelector, timePeriodsSelector],
    (data, currentIndex, timePeriods) => {
        const xs = data.find(d => d.key === timePeriods[currentIndex]);
        return xs ? xs.values : [];
    });

export default mostRecentDataSelector;
