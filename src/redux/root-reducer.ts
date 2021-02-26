import { combineReducers } from 'redux';
import activeRouteReducer from './active-route/activeRouteReducer';
import currentLocationReducer from './current-location/currentLocationReducer';
import mapReducer from './map/mapReducer';

const rootReducer = combineReducers({
    currentLocation: currentLocationReducer,
    activeRoute: activeRouteReducer,
    map: mapReducer,
});
export default rootReducer;
