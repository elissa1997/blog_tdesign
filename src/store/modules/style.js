export default {
  namespaced: true,
  state: {
    screenWidth: 0
  },
  getters: {},
  mutations: {
    resizeWidth(state, clientWidth) {
      state.screenWidth = clientWidth;
    },
  },
  actions: {},
}