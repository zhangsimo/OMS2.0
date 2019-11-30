<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db mr10">
            <span>快速查询：</span>
            <Select v-model="searchType" class="w100">
              <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="db mr10">
            <Input v-model="phone" placeholder="请输入手机号" style="width: 180px" />
          </div>
          <div class="db mr10">
            <Input v-model="company" placeholder="请输入公司名称" style="width: 180px" />
          </div>
          <div class="db">
            <Button type="warning" class="mr10" @click="search"><Icon custom="iconfont iconchaxunicon icons"/>查询</Button>
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
  import {allMessage} from '../../../api/lease/FeedbackManagement'
    export default {
        name: "FeedbackManagementOne",
        data(){
          return {
            json:{},
            List: [
              {name:"全部",value:9999},
              {name:"待处理",value:0},
              {name:"处理中",value:1},
              {name:"已解决",value:2}
            ],
            phone:'',
            company:'',
            ID: '',
            searchType:9999,
            loading: false,
            columns: [
              {
                title: '序号',
                align: 'center',
                width: 70,
                render: (h, params) => {
                  // console.log(params.index)
                  let num = params.index + 1
                  return h('span',num);
                }
              },
              {
                title: '手机号',
                align:'left',
                minWidth: 100,
                key:'recordMobile'
              },
              {
                title: '姓名',
                align:'left',
                key: 'createUname',
                minWidth: 100
              },
              {
                title: '公司名称',
                align:'left',
                key: 'orgname',
                minWidth: 170
              },
              {
                title: '问题摘要',
                align:'left',
                key: 'questionContent',
                minWidth: 200
              },
              {
                title: '反馈时间',
                align:'left',
                key: 'createTime',
                minWidth: 120
              },
              {
                title: '状态',
                align:'left',
                // key: 'status',
                minWidth: 100,
                render:(h,params) => {
                  // console.log(params.row.status)
                  let status = params.row.status
                  let zi = ''
                  if (status === 0){
                    zi = "待处理"
                  }
                  if(status === 1) {
                    zi = "处理中"
                  }
                  if(status === 2) {
                    zi = "已解决"
                  }
                  return h('span',zi)
                }
              },
              {
                title: '操作',
                // key: '',
                width: 160,
                align: 'center',
                render: (h, params) => {
                  let className = 'white'
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'info',
                        size: 'small',
                      },
                      style: {
                        color: "white"
                      },
                      class: className,
                      on: {
                        click: () => {
                          this.json = params.row;
                          this.show()
                        }
                      }
                    }, '查看')
                  ]);
                }
              }
            ],
            tbdata: [],
            page: {
              num: 1,
              size: 10,
              total: 0
            },
          }
        },
      methods:{
        selection(a){
          this.json = a
          // console.log(a)
          this.ID = a.id
          // console.log(this.ID)
        },
        changePage(p) {
        // console.log(p)
        this.page.num = p
        this.getList()
      },
        changeSize(size) {
        // console.log(size)
        this.page.num = 1
        this.page.size = size
        this.getList()
      },
        getList() {
          const params = {}
          // const data = {}
          if(this.searchType !== 9999){
            params.status = this.searchType
          }
          if(this.phone){
            params.recordMobile = this.phone
          }
          if(this.company){
            params.orgname = this.company
          }
          params.page = this.page.num - 1
          params.size = this.page.size
          this.loading = true
          allMessage(params).then(res => {
            // console.log(res , 'all')
            this.loading = false
            if (res.code === 0) {
              this.page.total = res.data.totalElements
              this.tbdata = res.data.content||[]
            }
          })
        },
        search() {
        this.page.num = 1
        this.getList()
        },
        show(){
          if(this.ID){
            console.log(this.json)
            this.$router.push({name: 'feedback_management',query:{json: this.json}})
          }
        }
      },
      mounted(){
          this.getList()
      },
      activated(){
        this.getList()
      }
    }
</script>

<style scoped>
  @import "index.css";
  @import "zhsh.css";
</style>
<style>
  .ivu-table .white span{
    color: white!important;
  }
</style>
