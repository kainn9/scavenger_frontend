import { combineReducers } from 'redux';

import currentLocationReducer from './current-location/currentLocationReducer';

const rootReducer = combineReducers({
    currentLocation: currentLocationReducer,
});
export default rootReducer;
