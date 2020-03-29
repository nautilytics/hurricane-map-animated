import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import createRootReducer from './reducers';

export default function configureStore(initialState) {
  return createStore(
    createRootReducer(), // root reducer with router state
    initialState,
    compose(applyMiddleware(thunk)),
  );
}
