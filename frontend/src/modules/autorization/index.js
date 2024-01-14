
import { routes } from "./routes.js";

import { useAutorizationStore } from './stores/autorization.js';

import { getAutorizationToken } from './api/getAutorizationToken.js';

export { useAutorizationStore, getAutorizationToken };

export default {
  
  routes,
  
  useAutorizationStore

};