<template>
    <div style="width: 100%;height: 100%;background-color:#fff;">
      <section class="Creditbox">
            <div class="db mr10">
              <span>快速查询：</span>
              <quickDate @quickDate="getvalue" class="mr10"></quickDate>
              <span>调整日期：</span>
              <DatePicker @on-change="getDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
              </DatePicker>
              <Button @click="query" type="warning" class="mr10 w90"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
        </div>
      </section>
      <div>
        <Table class="table-highlight-row"  :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns" :data="staffList"></Table>
      </div>
    </div>
</template>

<script>
    import quickDate from '@/components/getDate/dateget'
    import { getTableList } from '@/api/system/essentialData/lineOfCredit'
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
                        key: 'guestName'
                    },
                    {
                        title: '调整时间',
                        align: 'center',
                        key: 'applyDate'
                    },
                    {
                        title: '调整人',
                        align: 'center',
                        key: 'applyMan'
                    },
                    {
                        title: '调整时应付',
                        align: 'center',
                        key: 'payableAmt'
                    },
                    {
                        title: '调整时应收',
                        align: 'center',
                        key: 'receivableAmt'
                    },
                    {
                        title: '调整时应收应付合计',
                        align: 'center',
                        key: 'sumAmt',
                        width: '125px'
                    },
                    {
                        title: '应收30天金额',
                        align: 'center',
                        key: 'thirtyAmt'
                    },
                    {
                        title: '应收30-60天',
                        align: 'center',
                        key: 'sixtyAmt'
                    },
                    {
                        title: '应收60天以上',
                        align: 'center',
                        key: 'moreSixtyAmt'
                    },
                    {
                        title: '调整前临时额度',
                        align: 'center',
                        render: (h,params) => {
                            let tex = params.row.tempQuotaTotal == null ? 0 : params.row.tempQuotaTotal
                            return h('span',{},tex)
                    }
                    },
                    {
                        title: '调整后临时额度',
                        align: 'center',
                        key: 'tempQuotaTotal',
                        render: (h,params) => {
                            let tex = params.row.tempQuotaTotal == null ? 0 : params.row.tempQuotaTotal
                            return h('span',{},tex)
                    }
                    },
                    {
                        title: '临时额度开始时间',
                        align: 'center',
                        key: 'tempStart'
                    },
                    {
                        title: '临时额度结束时间',
                        align: 'center',
                        key: 'tempEnd'
                    },
                    {
                        title: '调整后剩余额度',
                        align: 'center',
                        key: 'afterAdjustQuota',
                        render: (h,params) => {
                            let tex = params.row.tempQuotaTotal == null ? 0 : params.row.tempQuotaTotal
                            return h('span',{},tex)
                    }
                    },
                ],
                staffList:[],
                Date: {
                  startTime: '',
                  endTime: ''
                },
                queryDate: {
                  startTime: '',
                  endTime: ''
                }
            }
        },
        created() {
           this.getTable()
        },
        methods: {
          async getTable(date) {
            let { code, data } = await getTableList(date)
            if (code === 0) {
              this.staffList = data
              this.loading = false
            } else {
              this.loading = true
            }
          },
          getvalue(date) {
            this.Date.startTime = date[0]
            this.Date.endTime = date[1]
            this.getTable(this.Date)
          },
          getDate(val) {
            this.queryDate.startTime = val[0] +  " " + "00:00:00"
            this.queryDate.endTime = val[1] +  " " + "23:59:59"
          },
          query() {
            this.getTable(this.queryDate)
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
