import { combineReducers } from 'redux';
import global from './modules/global';

export default () =>
  combineReducers({
    global,
  });
