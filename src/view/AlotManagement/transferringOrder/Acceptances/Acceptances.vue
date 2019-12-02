<template>
    <div class="content-oper content-oper-flex">
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db mr10">
              <span>快速查询：</span>
              <quickDate @quickDate="getData"></quickDate>
            </div>
            <div class="db flex">
              <span>开始日期：</span>
              <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
              </DatePicker>
            </div>
            <div class="db mr10">
              <Select v-model="searchType2" class="w100">
                <Option v-for="item in ListTwo" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db">
              <Input v-model="productName" placeholder="请输入选择公司" style="width: 100px" class="mr10"></Input>
              <Button type="warning" class="mr10 w90" @click="search"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        
      </section>
    </div>
</template>

<script>
  import QuickDate from '../../../../components/getDate/dateget'
  import '../../../lease/product/lease.less';
  import "../../../goods/goodsList/goodsList.less";
    export default {
        name: "Acceptances",
      components: {
        QuickDate
      },
        data(){
          return {
            selectOne: '', //定义变量赋值日期子组件的数据
            searchType2: 9999, //绑定的下拉框
            ListTwo: [{
              value: 9999,
              name: '全部'
            },
              {
                value: 1,
                name: '待受理'
              },
              {
                value: 2,
                name: '已受理'
              },
              {
                value: 3,
                name: '已拒绝'
              }],
            productName: '',
          }
        },
      methods: {
        //  日期选择器从子组件哪来的数据
        getData(A){
          console.log(A)
          this.selectOne = A
        },
        //选中的日期
        selectDate(date){
          this.dateTime = date
          console.log(this.dateTime)
        },
        //搜索
        search(){
          // this.getList()
        }
      }
    }
</script>

<style scoped>
.flex{
  display: flex;
  align-items: center;
}
</style>
