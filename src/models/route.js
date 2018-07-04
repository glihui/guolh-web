import { routerRedux } from 'dva/router';
export default {

  namespace: 'route',

  state: {
    Msg: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    // 路由跳转
    * redirect ({ payload }, { put }) {
      console.log(payload)
      yield put(routerRedux.push('/details', {name: 'dkvirus'}));
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
