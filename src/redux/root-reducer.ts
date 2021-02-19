import { combineReducers } from 'redux';

import projectReducer from './project/projectReducer';

const rootReducer = combineReducers({
    project: projectReducer,
});
export default rootReducer;
