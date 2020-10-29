export default {
  state:{
    orederQueryList:{},//快速查询数据
    oneOrder:{},//一条销售
    leftList:{},//右侧操作成功后返回的值
    salseList:[],//获取到员工跟往来单位
    filterGuestName:[],//记录销售订单客户筛选的数据
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
    },
    setSalseList(state ,data){
      state.salseList = data

    },
    SETGUESTNAME(state,data){
      state.filterGuestName = data
    }
  },
  actions:{
    setGuestName({commit},data){
      commit('SETGUESTNAME',data);
    }
  }

}
