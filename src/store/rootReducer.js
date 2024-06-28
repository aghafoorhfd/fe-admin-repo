import { combineReducers } from 'redux';
import theme from './slices/themeSlice';
import auth from './slices/authSlice';
import filters from './slices/filterSlice';
import analytics from './slices/analyticsSlice';
import customerActivation from './slices/customerActivationSlice';
import user from './slices/userSlice';
import plan from './slices/plansSlice';

const rootReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    auth,
    theme,
    filters,
    analytics,
    customerActivation,
    user,
    plan,
    ...asyncReducers
  });
  return combinedReducer(state, action);
};

export default rootReducer;
