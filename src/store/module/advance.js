export default {
  state: {
    claimedSearch: {
      suppliers: "",
      reciprocalAccountName: "",
      amount: 0,
      amountType: 0,
    },
  },
  getters: {
      getClaimedSearch(state) {
        let obj = {};
        for (let key in state.claimedSearch) {
            if(!!state.claimedSearch[key]) {
                obj[key] = state.claimedSearch[key]
            }
        }
        return obj;
      }
  },
  mutations: {
    setClaimedSearch(state, searchContent) {
        state.claimedSearch = searchContent;
    },
  },
  actions: {}
};
