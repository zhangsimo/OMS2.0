<template>
    <div class="box">
      <div class="mb100">
        <h1 class="titlecs">
          佳配经营情况
        </h1>
        <div class="titlecs dateT">
            本月目标进度(截止日期: <i>{{date}}</i> )
            本月时间进度: <i>{{monthDays}}</i>
        </div>
        <vxe-table
          height="250"
          border
          style="cursor:pointer"
          highlight-hover-row
          highlight-current-row
          align="center"
          @current-change="currentChangeEvent"
          header-row-class-name="headerTitle"
          :data="tableData">
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="name" title="指示名称"></vxe-table-column>
          <vxe-table-column field="sex" title="预算值">
            <template v-slot="{row}">
             {{ row.sex | getfour}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="age" title="实际值">
            <template v-slot="{row}">
              {{row.age | getfour}}
            </template>
          </vxe-table-column>
          <vxe-table-column field="lve" title="达成率">
            <template v-slot="{row}">
              {{gettLve(row.sex ,row.age)}}
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <div class="canvasBox">
      <div id="container" ></div>
      <div id="wire"></div>
      </div>
    </div>
</template>

<script>
  import {allmoneyList} from '@/api/set/userManagement'
  import Highcharts from 'highcharts'
  import moment from 'moment'
    export default {
        name: "balance",
        data(){
          return {
            options:{}, //柱形图数据
            chart:null, //柱形图dom(关闭的时候是否要销毁?)
            wire:null, //折现图dom(关闭的时候是否要销毁?)
            wList:{}, //折线图数据
            tableData:[
              {name:'收入' ,sex:1069332600, age:841368225 , lve:'85.59%'},
              {name:'成本' ,sex:1025982359 , age:808266642 , lve:'78.78%'},
              {name:'毛利' ,sex:43350240 , age:33101596 , lve:'76.35%'},
            ],//表格数据
            list:{},//当前需要展示的数据
            //预计
            predict:{
              2019:{
                income:[100000000,
                  60000000,
                  107000000,
                  109000000,
                  112000000,
                  115000000,
                  117000000,
                  120000000,
                  122000000,
                  120000000,
                  127000000,
                  131000000,
                ],//收入
                cost:[
                  96205333,
                  57634226,
                  102861163,
                  104681616,
                  107544707,
                  110444588,
                  112266369,
                  115167470,
                  117176334,
                  115229590,
                  121831915,
                  125679982,
                ],//成本
                grossMargin:[
                  3794667,
                  2365774,
                  4138837,
                  4318384,
                  4455294,
                  4555411,
                  4733631,
                  4832530,
                  4823666,
                  4770410,
                  5168085,
                  5320018,
                ]//毛利
              },
              2020:{
                income:[
                  86273861,
                  116344772,
                  118643279,
                  122690637,
                  123524127,
                  124351545,
                  125172426,
                  125886316,
                  126445637,
                  0,
                  0,
                  0
                ],//收入
                cost:[
                  82788444,
                  111615356,
                  113823498,
                  117712965,
                  118515116,
                  119311477,
                  120101615,
                  120788089,
                  121325799,
                  0,
                  0,
                  0
                ],//成本
                grossMargin:[
                  3485414,
                  4729416,
                  4819782,
                  4977674,
                  5009014,
                  5040065,
                  5070809,
                  5098226,
                  5119840,
                    0,
                  0,
                  0
                ]//毛利
              }
            },
            //实际
            reality:{
              2019:{
                income:[
                  99116299,
                  58583938,
                  110224893,
                  110371911,
                  106655485,
                  97859662,
                  105456719,
                  110460627,
                  115375854,
                  102443823,
                  108254310,
                  104638186,
                ],//收入
                cost:[
                  95053043,
                  56600691,
                  105895648,
                  106128524 ,
                  102582198,
                  93704634,
                  100952041,
                  105875147,
                  110766370,
                  97820093,
                  103969444,
                  100742691,

                ],//成本
                grossMargin:[
                  4063253,
                  1983235,
                  4329246,
                  4243391,
                  4073287,
                  4155028,
                  4504676,
                  4585480,
                  4609482,
                  4623733,
                  4284870,
                  3895493,
                ]//毛利
              },
              2020:{
                income:[
                  73833504,
                  12191166,
                  95502302,
                  107899572,
                  114362345,
                  121978655,
                  105977195,
                  111048351,
                  98575135,
                ],//收入
                cost:[
                  70401072,
                  11668836,
                  91266815,
                  103632699,
                  109827823,
                  116836218,
                  102479976,
                  107023099,
                ],//成本
                grossMargin:  [
                  3432432,
                  522325,
                  4235498,
                  4266875,
                  4534521,
                  5142440,
                  3497217,
                  4025257,
                ]//毛利
              }
            },
            //日期
            date:moment().format("YYYY-MM-DD"),
            circle:30,//进度
          }
    },
      mounted(){
        this.getList()
      },
      methods: {
          //柱形图展示
          showForm(){
             this.options = {
               chart: {
                 type: 'column',
                 options3d: {
                   enabled: true,
                   alpha: 5,
                   beta: -10,
                   depth: 50,
                   viewDistance: 25,
                 },
                 marginTop: 50,
                 marginRight:20
               },
               title: {
                 text: '华胜集团资产负债表',
                 style:{
                   fontWeight:'bold',
                   color:'#000000',
                   fontSize: "18px"
                 },
                 marginTop:40
               },
               xAxis: {
                 categories: ['1月', '2月', '3月', '4月', '5月','6月','7月','8月','9月','10月','11月','12月']
               },
               yAxis: {
                 allowDecimals: false,
                 min: 0,
                  max:150000000,
                 title: {
                   text: '',
                   visible:false
                 },
                 stackLabels: {  // 堆叠数据标签
                   enabled: true,
                   formatter: function () {
                     return this.total;
                   },
                   style: {
                     fontWeight: 'bold',
                     color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                   }
                 }
               },
               tooltip: {
                 headerFormat: '<b>{point.key}</b><br>',
                 pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
               },
               plotOptions: {
                 column: {
                   stacking: 'normal',
                   depth: 25
                 }
               },
               series: [{
                 name: '目标值',
                 data: [],
                 stack: 'male',
                 color:'#98e3ff'
               }, {
                 name: '实际值',
                 data: [],
                 stack: 'female',
                 color:'#5f9aff'
               }]
            }
            this.options.series.forEach(item => {
              switch (item.name) {
                case '目标值':
                item.data = this.list.predict
                break
                case '实际值':
                item.data = this.list.reality
              }
            })
            Highcharts.setOptions({
              lang:{
                numericSymbols:null
              }
            })
           this.chart = Highcharts.chart('container', this.options)
        },

        //折线图
        showWire(){
          this.wList ={
            title: {
              text: '华胜集团2019-2020资产对比',
              style:{
                fontWeight:'bold',
                color:'#000000',
                fontSize: "18px"
              },
            },
            chart: {
              type: 'line',
              marginRight: 50
            },
            subtitle: {
            },
            yAxis: {
              title: {
                text: '资产',
                style:{
                  color:'#000000',
                  fontSize: "18px"
                },
              }
            },
            xAxis: {
              categories: ['1月', '2月', '3月', '4月', '5月','6月','7月','8月','9月','10月','11月','12月']
            },
            legend: {
              layout: 'vertical',
              align:'right',
              verticalAlign: 'middle'
            },
            // plotOptions: {
            //   series: {
            //     label: {
            //       connectorAllowed: false
            //     },
            //     pointStart: 1
            //   }
            // },
            series: [{
              name: '2019',
              data: []
            }, {
              name: '2020',
              data: []
            }
           ],
            responsive: {
              rules: [{
                condition: {
                  // maxWidth: 400
                },
                chartOptions: {
                  legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                  }
                }
              }]
            }
          }

          //切换数据
          this.wList.series.forEach(item => {
            switch (item.name) {
              case '2019':
                item.data = this.list.lastReality
                break
              case '2020':
                item.data = this.list.reality
            }
          })
          this.wList.yAxis.title.text = this.list.title

          this.wire = Highcharts.chart('wire' , this.wList)
        },

        //进入页面刷获取数据
     async   getList(){
            let res = await allmoneyList()
       if (res.code === 0){
         this.reality[2019].income = []
         this.reality[2020].income = []
         var salesALL= 0,
              amtAll = 0
          res.data.forEach( item => {
            if (item.salesMonth.includes('2019')){
              this.reality[2019].income.push(Math.floor(item.sellAmt))
            }else {
              this.reality[2020].income.push(Math.floor(item.sellAmt))
              salesALL =  this.$utils.add(salesALL , item.sellAmt)
            }
            this.$utils.add(amtAll , item.sellAmt)
          })
         this.tableData[0].age = salesALL.toFixed(0)
       }
       let newAmt =[],
         amt=[]
       res.data.slice(20).forEach( item =>{
         newAmt.push(Math.floor(item.enterAmt))
         amt.push(Math.floor(item.amt))
       })

       this.reality[2020].cost = [...this.reality[2020].cost , ...newAmt]
       this.reality[2020].grossMargin = [...this.reality[2020].grossMargin , ...amt]

          this.list = {
            predict: this.predict[2020].income,
            reality:this.reality[2020].income,
            lastReality:this.reality[2019].income,
            title:'收入'
          }
          this.showForm()
          this.showWire()
        },

        //表格选中
        currentChangeEvent({row}){
          switch (row.name) {
            case '收入':
              this.list = {
                predict: this.predict[2020].income,
                reality:this.reality[2020].income,
                lastReality:this.reality[2019].income,
                title:row.name
              }
              this.showForm()
              this.showWire()
              break
            case '成本':
              this.list = {
                predict: this.predict[2020].cost,
                reality:this.reality[2020].cost,
                lastReality:this.reality[2019].cost,
                title:row.name
              }
              this.showForm()
              this.showWire()
              break
            case '毛利':
              this.list = {
                predict: this.predict[2020].grossMargin,
                reality:this.reality[2020].grossMargin,
                lastReality:this.reality[2019].grossMargin,
                title:row.name
              }
              this.showForm()
              this.showWire()
              break
          }
        },
      },
      computed:{
        gettLve(all,now){
          return function (all , now) {
            return  this.$utils.divide( now , all).toFixed(2) * 100 +'%'

          }
        },
        //获取当前月天数
        monthDays(){
          let  days = moment().format('DD')
          let  mon = moment().endOf('day').format('DD')
          let lve  = this.$utils.divide(days , mon).toFixed(0)
          return lve*100 +'%'
        }
      },
      filters:{
          getfour(value){
              if (value){
                return value.toString().replace(/\B(?=(\d{4})+(?!\d))/g, ',')
              }
          }
      }
    }
</script>

<style scoped lang="less">
.box {
  background-color: #fff;
  height: 100%;
}
.canvasBox {
  display: grid;
  grid-template-rows: repeat(1, 400px);
  grid-template-columns: repeat(2, 49%)
}
.titlecs {
  border: 1px #e8eaec solid;
  border-bottom: none;
  line-height: 48px;
  text-align: center;
}

</style>
<style scoped>

</style>
