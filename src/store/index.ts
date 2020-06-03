import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducers';
import storage from './redux-persist-taro-storage';

const composeEnhancers =
  typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
    ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const middlewares = [thunkMiddleware];

if (
  process.env.NODE_ENV === 'development' &&
  process.env.TARO_ENV !== 'quickapp'
) {
  middlewares.push(require('redux-logger').createLogger());
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
  // other store enhancers if any
);

const persistConfig = {
  key: 'app',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configStore() {
  const store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store);
  return { store, persistor };
}
