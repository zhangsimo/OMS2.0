<template>
  <div>
    <Tabs type="card" :animated="false">
        <TabPane label="基本信息">
          <div>
            <dateget class="mr10"></dateget>
            <span class="mr10">日期从：</span>
            <Date-picker
              type="daterange" 
              class="w200 mr20" 
              :options="options3"
              @on-change="dateChange" 
              placeholder="请选择日期"
            >
            </Date-picker>
          </div>
        </TabPane>
        <TabPane label="包装规格">
        </TabPane>
      </Tabs>
  </div>
</template>
<script>
  import dateget from '../../../components/getDate/dateget'
  export default {
    name: 'brandList',
    components: {dateget},
    data() {
      return {
        // 日期数据
        options3: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now();
          }
        },
        dateList: {},
        dateArray: [],
      }
    },
    components: {},
    activated() {
    },
    mounted() {
    },
    methods: {
      dateChange (value) {
        // console.log(value)
        this.dateArray = [value]
        if(value[0] === ""){
          this.dateList = {}
        }else {
          this.dateList.startApplyTime = value[0] + " " + "00:00:00"
          this.dateList.endApplyTime = value[1] + " " + "23:59:59"
        }
      },
    },
    computed: {
    }
  }
</script>
