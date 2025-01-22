import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import style from './modules/style.js';
import dictv2 from './modules/dictv2.js';
import dict from './modules/dict.js';
import user from './modules/user.js';

export default new Vuex.Store({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {},
  modules: {
    style,
    dictv2,
    dict,
    user
  }

})