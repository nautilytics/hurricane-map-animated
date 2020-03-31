import { createSelector } from 'reselect';
import moment from 'moment';
import { DATE_TIME_FORMAT } from '../../constant';

const nestedDataSelector = state => state.global.nestedData;
const currentIndexSelector = state => state.global.currentIndex;
const timePeriodsSelector = state => state.global.timePeriods;

const mostRecentDataSelector = createSelector(
  [nestedDataSelector, currentIndexSelector, timePeriodsSelector],
  (data, currentIndex, timePeriods) => {
    const xs = data.filter(d => moment(d.key, DATE_TIME_FORMAT).isSameOrBefore(moment(timePeriods[currentIndex], DATE_TIME_FORMAT)));
    return xs
      ? [].concat.apply(
          [],
          xs.map(x => x.values),
        )
      : [];
  },
);

export default mostRecentDataSelector;
