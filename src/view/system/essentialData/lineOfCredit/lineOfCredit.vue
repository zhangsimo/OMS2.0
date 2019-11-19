<template>
    <div style="width: 100%;height: 100%;background-color:#fff;">
      <section class="Creditbox">
            <div class="db mr10">
              <span>快速查询：</span>
              <quickDate @quickDate="getvalue" class="mr10"></quickDate>
              <span>开始日期：</span>
              <DatePicker @on-change="getDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
              </DatePicker>
              <Button type="warning" class="mr10 w90"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
        </div>
      </section>
      <div>
        <Table class="table-highlight-row"  :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns" :data="staffList"></Table>
      </div>
    </div>
</template>

<script>
    import quickDate from '@/components/getDate/dateget'
    export default {
        name: "lineOfCredit",
        components:{
            quickDate
        },
        data(){
            return {
                loading: true,
                columns:[
                    {
                        type: 'index',
                        width: 50,
                        align: 'center',
                        title:'序号'
                    },
                    {
                        title: '客户名称',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整时间',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整人',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整时应付',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整时应收',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整时应收应付合计',
                        align: 'center',
                        key: '',
                        width: '125px'
                    },
                    {
                        title: '应收30天金额',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '应收30-60天',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '应收60天以上',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整前临时额度',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整后临时额度',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '临时额度开始时间',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '临时额度结束时间',
                        align: 'center',
                        key: ''
                    },
                    {
                        title: '调整后剩余额度',
                        align: 'center',
                        key: ''
                    },
                ],
                Date: ''
            }
        },
        methods: {
          getvalue(data) {
            this.Date = data
            window.console.log(data)
          },
          getDate(val) {
            this.Date = val
            window.console.log(val)
          }
        }
    }
</script>

<style scoped lang="less">
.Creditbox {
  padding-left: 10px;
  line-height: 57px;
  border-bottom: 1px #e0e0e0 solid;
}
</style>
