import { createSelector } from 'reselect';

const nestedDataSelector = state => state.global.nestedData;
const currentIndexSelector = state => state.global.currentIndex;

const mostRecentDataSelector = createSelector([nestedDataSelector, currentIndexSelector], (data, currentIndex) => {
  return data[currentIndex];
});

export default mostRecentDataSelector;
