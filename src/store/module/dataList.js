export default {
  state:{
    orederQueryList:{},//快速查询数据
    oneOrder:{},//一条销售
  },
  mutations:{
    setOrederQuery(state,data){
      state.orederQueryList = data
    },
    setOneOrder(state ,data){
      state.oneOrder = data
    }
  }

}
