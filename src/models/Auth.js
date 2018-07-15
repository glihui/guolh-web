import { API, URI } from '../utils/api';

export default {
  namespace: 'Auth',
  state: {
    User: {},
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveMsg(state, { payload }) {
      let meta = state.User.meta;
      let tmpUser = payload;
      tmpUser.User.meta= meta;
      return { ...state, ... tmpUser}
    }
  },

  effects: {
    *load({ payload }, { put }) {
      const response = yield API.get(URI.Auth.Me, {}, {Authorization: `Bearer ${payload.token}`});
      if (response.id) {
        yield put({ type: 'saveMsg', payload: {User: response} });
      }
    },
    *saveUser({ payload: { User }}, { put }) {
      yield put({ type: 'save', payload: { User }});
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
    }
  }
}
