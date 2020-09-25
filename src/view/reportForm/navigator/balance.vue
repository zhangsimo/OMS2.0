<template>
    <div class="box">
      <div id="container" style="height: 600px; width:80%"></div>
    </div>
</template>

<script>
    export default {
        name: "balance",
        data(){
          return {
            options:{},
            chart:null
          }
    },
      mounted(){
          this.showForm()
      },
      methods: {
          showForm(){
             this.options = {
               chart: {
                 type: 'column',
                 options3d: {
                   enabled: true,
                   alpha: 15,
                   beta: 15,
                   viewDistance: 25,
                   depth: 40
                 },
                 marginTop: 80,
                 marginRight: 20
               },
               title: {
                 text: '华盛集团资产负债表'
               },
               xAxis: {
                 categories: ['1月', '2月', '3月', '4月', '5月','6月','7月','8月','9月','10月','11月','12月']
               },
               yAxis: {
                 allowDecimals: false,
                 min: -20000000,
                  max:200000000,
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
                   depth: 40
                 }
               },
               series: [{
                 name: '目标',
                 data: [70000000, 100000000, 100000000, 100000000, 100000000, 100000000, 100000000, 100000000, 100000000, 100000000, 100000000,10000000],
                 stack: 'male'
               }, {
                 name: '小彭',
                 data: [2000000, 5000000, 6000000, 20000000, 10000000,200000, 5000000, 60000000, 2000000, 10000000 ,20000000, 40000000],
                 stack: 'female'
               }, {
                 name: '小潘',
                 data: [30000000, 100000000, 40000000, 40000000, 3000000,30000000, 100000000, 40000000, 4000000, 30000000,200000,30000000],
                 stack: 'female'
               }]
            }
            Highcharts.setOptions({
              lang:{
                numericSymbols:null
              }

            })
           this.chart = Highcharts.chart('container', this.options)
        }
      }
    }
</script>

<style scoped lang="less">
.box {
  background-color: #fff;
}
</style>
