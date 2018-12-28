import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import common from './module/common'
import getters from './getters.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    common
  },
  getters
})
