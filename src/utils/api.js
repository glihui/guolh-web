/**
 * Created by henry on 2017/7/12.
 */
import { Ajax } from './request';
import config from '../config';

export const URI = {
  Auth: {
    Login: '/authorizations',
    Register: '/register',
    Logout: '/auth/logout',
    Me: '/user',
  },
  User: {
    Token: '/user/qiniu',
    UpdateUser: '/user/update',
    Password: '/user/password',
  },
  Topic: {
    Topic: '/topics',
    Category: '/categories',
  },
  WebSocket: {
    All: config.WEBSOCKET_URI,
  },
  buildUrl: (uri) => {
    return config.SERVER_URI + uri;
  },
};

export const API = {
  get: async (uri, params, headers) => {
    return Ajax.get(config.SERVER_URI + uri, params, headers);
  },
  post: async (uri, params, headers) => {
    return Ajax.post(config.SERVER_URI + uri, params, headers);
  },
  put: async (uri, params) => {
    return Ajax.put(config.SERVER_URI + uri, params);
  },
  delete: async (uri, params) => {
    return Ajax.delete(config.SERVER_URI + uri, params);
  },
  open: (uri, params) => {
    const args = Ajax.buildParams(params);
    let breakSign = '?';
    if (uri.indexOf('?') >= 0) {
      breakSign = '&';
      if (uri && uri.length && uri[uri.length - 1] === '&') {
        breakSign = '';
      }
    }
    return window.open(`${config.SERVER_URI}${uri}${breakSign}${args}`);
  },
};
