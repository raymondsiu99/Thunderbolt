import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer';

// Placeholder reducer
const rootReducer = (state = {}, action) => state;

export const store = configureStore({
    reducer: rootReducer,
});
