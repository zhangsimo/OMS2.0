import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import common from './module/common'
import getters from './getters.js'
import dataList from './module/dataList'

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
    ...moduleStores,
  },
  getters
})
