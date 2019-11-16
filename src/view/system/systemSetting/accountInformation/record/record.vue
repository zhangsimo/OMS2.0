<template>
    <div>
      <section class="oper-box">
        <div class="oper-top flex">
          <div class="wlf">
            <div class="db mr10">
              <span>审核状态：</span>
              <Select v-model="searchType1" class="w100">
                <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db mr10">
              <span>是否禁用：</span>
              <Select v-model="searchType2" class="w100">
                <Option v-for="item in ListTwo" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </div>
            <div class="db flex">
              <span>创建日期：</span>
              <DatePicker @on-change="selectDate" type="daterange" placement="bottom-start" placeholder="选择日期"
                          class="w200 mr20">
              </DatePicker>
              <Button type="warning" class="mr10 w90" @click="search"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
            </div>
            <div class="db">
              <Button class="mr10 w90" @click="Audit"><span class="center"><Icon custom="iconfont iconshenheicon icons" />审核</span></Button>
            </div>
          </div>
        </div>
      </section>
      <section class="con-box">
        <Table class="table-highlight-row" size="small" highlight-row :loading="loading" border :stripe="true" :columns="columns" :data="tbdata" @on-row-click="selection"></Table>
        <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
              @on-page-size-change="changeSize" show-sizer show-total>
        </Page>
      </section>
    </div>
</template>

<script>
    export default {
        name: "record",
      data(){
          return{
            columns: [
              {
                title: '选择',
                align: 'center',
                width: 70,
                render:(h,params) => {
                  return h('span',{
                    class:'table-radio'
                  })
                }
              },
              {
                title: '租户ID',
                align:'left',
                minWidth: 100,
                key:'tenantId'
              },
              {
                title: '手机号',
                align:'left',
                key: 'mobile',
                minWidth: 120
              },
              {
                title: '公司名称',
                align:'left',
                key: 'companyName',
                minWidth: 170
              },
              {
                title: '省份',
                align:'left',
                key: 'provinceName',
                minWidth: 120
              },
              {
                title: '城市',
                align:'left',
                key: 'cityName',
                minWidth: 120
              },
              {
                title: '审核状态',
                align:'left',
                key: 'status',
                minWidth: 120,
                render:(h,params) => {
                  let stat = JSON.parse(params.row.status||{})
                  let className = 'red'
                  if(stat.value===1){
                    className = 'blue'
                  }
                  return h('span',{
                    class:className
                  },stat.name?'● '+stat.name:'')
                }
              },
              {
                title: '是否禁用',
                align:'left',
                key: 'isDisabled',
                minWidth: 120,
                render:(h,params) => {
                  // console.log(params.row.isDisabled)
                  let state = params.row.isDisabled
                  let zi = ''
                  if (state === 0){
                    zi = "否"
                  }
                  if(state === 1) {
                    zi = "是"
                  }
                  return h('span',zi)
                }
              },
              {
                title: '租户类型',
                align:'left',
                key: 'typeName',
                minWidth: 130
              },
              {
                title: '审核人',
                align:'left',
                key: 'name',
                minWidth: 120
              },
              {
                title: '审核时间',
                align:'left',
                key: 'updateTime',
                minWidth: 160
              }
            ],
            tbdata: [],
            page: {
              num: 1,
              size: 10,
              total: 0
            },
          }
      }
    }
</script>

<style scoped>

</style>
