export default {
  state:{
    orederQueryList:{},//快速查询数据
    oneOrder:{},//一条销售
    leftList:{},//右侧操作成功后返回的值
  },
  mutations:{
    setOrederQuery(state,data){
      state.orederQueryList = data
    },
    setOneOrder(state ,data){
      state.oneOrder = data
    },
    setleftList(state ,data){
      state.leftList = data
    }
  }

}
