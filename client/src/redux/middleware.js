import { logout } from './authSlice';

const tokenExpirationMiddleware = (store) => (next) => (action) => {
  if (
    action.type.endsWith('/rejected') &&
    action.payload &&
    action.payload.message === 'Token expired'
  ) {
    store.dispatch(logout());
  }
  return next(action);
};

export default tokenExpirationMiddleware;
