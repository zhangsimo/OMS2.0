import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import common from './module/common'
import getters from './getters.js'
import dataList from './module/dataList'
import advance from './module/advance'
import businessBorrowing from './module/businessBorrowing'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const context = require.context('./mod', false, /\.ts$/);
const moduleStores = {};
context.keys().forEach(key => {
  const fileName = key.slice(2, -3);
  const fileModule = context(key).default;
  moduleStores[fileName] = {
    ...fileModule,
    namespaced: true,
  }
})

export default new Vuex.Store({
  modules: {
    user,
    app,
    common,
    dataList,
    advance,
    businessBorrowing,
    ...moduleStores,
  },
  getters,
  plugins: [createPersistedState({
    // key: 'OMS2'+ +new Date(),
    storage: window.sessionStorage
  })]
})
