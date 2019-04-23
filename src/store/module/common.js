const state = {
  status: false // 用于控制自定义遮罩
}

// actions
const actions = {
  setMask ({commit, state}, data) {
    commit('SET_MASK', data)
  }
}

// mutations
const mutations = {
  SET_MASK (state, status) {
    state.status = status
  }
}

export default {
  state,
  actions,
  mutations
}
