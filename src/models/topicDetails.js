export default {

  namespace: 'topicDetails',

  state: {
    Msg: {},
  },

  subscriptions: {
  },

  effects: {
    *saveId({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save', payload });
    },
  },

  reducers: {
    save(state, action) {
      console.log(action)
      return { ...state, ...action.payload };
    },
  },

};
