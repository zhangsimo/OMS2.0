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
            <Button class="mr10 w90" :disabled="auditBtnDis" v-has="'audit'"  @click="Audit"><span class="center"><Icon custom="iconfont iconshenheicon icons" />审核</span></Button>
            <Button class="mr10 w90" v-has="'start'" v-show="jin" @click="warning"><span class="center"><Icon custom="iconfont iconjinzhijinyongicon icons" />禁用</span></Button>
            <Button class="mr10 w90" v-has="'start'" v-show="qi" @click="JinOrQi2"><span class="center"><Icon custom="iconfont iconqiyongicon icons" />启用</span></Button>
          </div>
          <Modal v-model="tenant_audit" title="租户审核" width="450px">
            <!--<div class="audit_header"><h1>租户审核</h1><Icon type="close-round" @click="cancel" class="cl_white"></Icon></div>-->
            <div class="audit_nav">
              <Tabs type="card" @on-click="showRadio" class="navgation">
                <Tab-pane v-for="(item,index) in arrAudit"  :label="item.dictName" :key="index">
                  <Radio-group v-model="radioSelect" vertical @on-change="xuanzhong">
                    <Radio v-for="(v,i) in item.itemVOS" :label="v.itemCode" :key="i">{{v.itemName}}</Radio>
                  </Radio-group>
                </Tab-pane>
              </Tabs>
            </div>
                  <div class="audit_nav2" slot="footer">
                    <Button type="error" @click="Pass" class="mr20">审核通过</Button>
                    <Button @click="cancel" class="w90">取消</Button>
                  </div>
          </Modal>
          <Modal v-model="tenant_audit_sure" title="审核通过">
            <Form :label-width="80" :model="tenant_audit_data" ref="formValidate">
              <FormItem label="前缀:">
                <span>{{tenant_audit_data.prefix}}</span>
              </FormItem>
              <FormItem label="域:">
                <span>{{tenant_audit_data.domain}}</span>
              </FormItem>
              <FormItem label="登录账号:">
                <span>{{tenant_audit_data.userName}}</span>
              </FormItem>
              <FormItem label="初始密码:">
                <span>{{tenant_audit_data.userPassword}}</span>
              </FormItem>
            </Form>
            <div class="audit_nav2" slot="footer">
              <Button type="error" @click="PassSure" class="mr20">确定</Button>
            </div>
          </Modal>
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
  import {queryAll, update} from '_api/business/goodsApi'
  import {getMessagelist,findAllTenantType,Reviewtenant,SHstate,trialRegister,findByCode,getMessagelist2} from '../../../api/lease/registerApi'

    export default {
        name: "registers",
        data(){
          return {
            auditBtnDis: false,
            List: [],
            ListTwo: [{
              value: 9999,
              name: '全部'
            },
              {
                value: 1,
                name: '是'
              },
              {
                value: 0,
                name: '否'
              }],
            searchType1: 9999,
            searchType2: 9999,
            value1: '',
            value2: '',
            abc:'.',
            dateTime: '',
            index: 0,
            at_present: '',
            arrAudit: [],
            AuditChild:[],
            tenant_audit: false,
            tenant_audit_sure:false,
            tenant_audit_data:{},
            // clickd: 1,
            jin: false,
            qi: true,
            loading: false,
            statuss: 5,
            zhuanagtai: '',
            returnName: '',
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
                key: 'auditMan',
                minWidth: 120
              },
              {
                title: '审核时间',
                align:'left',
                key: 'auditDate',
                minWidth: 160
              }
            ],
            tbdata: [],
            page: {
              num: 1,
              size: 10,
              total: 0
            },
            radioSelect:'QXS01',
            // buttonsShow:{},//权限按钮展示
            tenantTypeId: '9223372036854775807',
            tenantTypeName:'洗美店'
          }
        },
      mounted(){
        this.getList()
         // this.buttonsShow = this.$ButtonShow()
      },

      created(){
        // 审核状态
        SHstate().then((res) => {
          // console.log(res)
          this.List = res.data
          this.List.unshift({name:"全部",value:9999})
        })
      },
      methods: {
        showRadio(row){
          console.log(row)
          // console.log(this.radioSelect)
        },
          //查找状态
        selection(a){
          if(a.status) {
            var status = JSON.parse(a.status)
            if(status.value == 1) {
              this.auditBtnDis = true;
            } else {
              this.auditBtnDis = false;
            }
          }
          this.at_present = a.id
          // console.log(a.isDisabled)
          let statusss = JSON.parse(a.status || [])
          // console.log(statusss.value)
          this.statuss = statusss.value
          // console.log(this.statuss)
          this.zhuanagtai = a.isDisabled
          // console.log(this.zhuanagtai)
          if (a.isDisabled === 0) {
            this.jin = true
            this.qi = false
          }else{
            this.jin = false
            this.qi = true
          }
        },
        selectDate(date) {
          this.dateTime = date
          console.log(this.dateTime)
          // this.search()
        },
        // 审核radio值
        xuanzhong(val){
          // console.log(val)
          // console.log(this.arrAudit)
         let a =  this.arrAudit.map(item => {
            return item.itemVOS
          })
          // console.log(a)
          let b = a.map(item => {
            return item.filter(item => item.itemCode == val)
          })
          let c = b.filter(item => item.length > 0)
          // console.log(c)
          this.tenantTypeId = c[0][0].id
          this.tenantTypeName = c[0][0].itemName
          console.log(this.tenantTypeId)
          console.log(this.tenantTypeName)
        },
        //审核弹窗
        Audit(){
          // console.log(this.statuss)
          if (this.statuss == 5){
            //  this.auditBtnDis = true;
          }else if(this.statuss == 1){
            this.$Message.warning('至少选中一条记录')
          }else{
            this.tenant_audit = true
            Reviewtenant().then((res) =>{
              // console.log(res)
              let arrData = res.data||[]
              this.arrAudit = arrData.map(item =>{
                item.radioSelect = ''
                // console.log(this.redioSelect)
                return item
              })
            })
          }
        },
        //查字典
        findType(data){
        // return  this.arr.find( item => item.Code == data.type)
          // findByCode().then((res) => {
          //   console.log(res)
          // })
        },
        //审核通过
        Pass(){
          let data = {
            type:this.radioSelect,
            status: 1,
            id:this.at_present,
            tenantTypeId: this.tenantTypeId,
            tenantTypeName: this.tenantTypeName
          }
          trialRegister(data).then((res) => {
            if(res.code === 0){
              this.tenant_audit = false
              this.tenant_audit_data=res.data;
              this.tenant_audit_sure=true;
            }
          })
         },
        PassSure(){
          this.getList()
          this.tenant_audit_sure=false;
          this.tenant_audit_data={};
        },
        //取消
        cancel(){
          this.tenant_audit = false
        },
        //禁用
        warning(){
          if (this.zhuanagtai === 0){
            let name = {
              isDisabled: 1,
              id:this.at_present
            }
            trialRegister(name).then((res) =>{
              this.$Message.warning('禁用成功')
              this.zhuanagtai = ''
              this.getList()
            })

          } else {
            this.$Message.warning('至少选中一条记录!')
            return false
          }

        },
        //启用
        JinOrQi2(){
          if(!this.zhuanagtai){
            this.$Message.warning('至少选中一条记录!')
            return false
          }else {
            let name = {
              isDisabled: 0,
              id: this.at_present
            }
            trialRegister(name).then((res) =>{
              this.$Message.success('启用成功')
              this.zhuanagtai = ''
              this.getList()
            })
          }
        },
        //分页
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
        search() {
          this.page.num = 1
          this.getList()
        },
        //初始化
        getList() {
          const params = {}
          const data = {}
          if(this.searchType1 !== 9999){
            data.status = this.searchType1
          }
          if (this.searchType2 !== 9999) {
            data.isDisabled = this.searchType2
          }
          if (this.dateTime[0]) {
            data.startTime = this.dateTime[0] + " 00:00:00"
            data.endTime = this.dateTime[1] + " 23:59:59"
          }
          params.page = this.page.num - 1
          params.size = this.page.size
            // console.log(params)
          this.loading = true;
          getMessagelist({params:params,data:data}).then(res => {
            // console.log(res , 'all')
            this.loading = false
            if (res.code === 0) {
              this.page.total = res.data.totalElements
              this.tbdata = res.data.content||[]
              // if(arrData.length>0){
              //   arrData.map((item,index)=>{
              //     item.typeName=""
              //     findByCode({dictCode:item.type}).then((res) => {
              //       //this.returnName = res.data.dictName
              //       arrData[index].typeName = res.data.dictName
              //     })
              //   })
              // }
              // this.tbdata = arrData
            }
          })
        },
      }
    }
</script>

<style scoped>
  @import "index.css";
  @import "zhsh.css";
</style>
