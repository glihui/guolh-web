export default {

  namespace: 'topicList',

  state: {
    data: {
      data: []
    },
  },

  subscriptions: {
  },

  effects: {
    *saveData({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save', payload });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
