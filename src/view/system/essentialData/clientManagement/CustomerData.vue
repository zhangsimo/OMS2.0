<template>
    <div style="height:100%">
      <div class="header-box">
        <span >客户编码:</span>
        <Input v-model="coding"  style="width: 150px" class="mr10"/>
        <span>客户全称:</span>
        <Input v-model="customerName"  style="width: 150px" class="mr10"/>
        <span>联系人电话:</span>
        <Input v-model="tel"  style="width: 150px" class="mr20"/>
        <Button type="warning" class="w90 mr10" @click="queryList">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
        </Button>
        <Button class="w90 mr10" @click="openMore">
              <span class="center">
                …更多
              </span>
        </Button>
      </div>
      <div class="operation">
        <Button class="w90 mr10" @click="addClient">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
        </Button>
        <Button class="w90 mr10" @click="changeClient">
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
        </Button>
      </div>
      <div class="tabeBox" >
      <div style="width: 3000px">
        <Table  @on-current-change="pitchOneCoustomer" :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns" :data="managementList"></Table>
      </div>
        <Page
          class-name="page-con"
          :current="page.num"
          :total="page.total"
          :page-size="page.size"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-sizer
          show-total
          show-elevator
          class="mr10"
        ></Page>
      </div>

<!--      更多-->
      <Modal v-model="moreQueryShow" title="高级查询" width="640">
        <Query :data="moreQueryOne" :provincearr="provinceArr"></Query>
        <div slot='footer'>
          <Button type='primary' @click="querySure">确定</Button>
          <Button type='default' @click='moreQueryShow = false'>取消</Button>
        </div>
      </Modal>

<!--      客户资料-->
      <Modal v-model="clientDataShow" title="客户资料"  width="700">
        <ClientData :data="clientList" :provincearr="provinceArr" :treelist="treeDiagramList" ref="child"></ClientData>
        <div slot='footer'>
          <Button type='primary' @click = addNewClient>确定</Button>
          <Button type='default' @click='clientDataShow = false'>取消</Button>
        </div>
      </Modal>

    </div>
</template>

<script>
  import Query from "./Query";
  import ClientData from './ClientData'
  import {getCustomerInformation,getNewClient , getCustomerDetails} from '@/api/system/essentialData/clientManagement'
  import {area} from '@/api/lease/registerApi'

    export default {
        name: "CustomerData",
        components:{
            Query,
            ClientData
        },
        props:{
            treeDiagramList:''
        },
        data(){
            return {
                coding:'',
                customerName:'',
                tel:'',
                moreQueryOne:{},
                loading: true,
                provinceArr:'',
                page:{
                    size:10,
                    num:1,
                    total:0
                },
                columns:[
                    {title: '序号',
                     align: 'center',
                     type: 'index',
                     key: 'name',

                    },
                    {title: '基本信息',
                     align: 'center',
                     children:[
                         {
                             title: '客户编码',
                             key: 'code',
                             align: 'center',
                         },
                         {
                             title: '客户简称',
                             key: 'shortName',
                             align: 'center',
                         },
                         {
                             title: '客户全称',
                             key: 'fullName',
                             align: 'center',
                         },
                     ]
                    },
                    {title: '联系人信息',
                        align: 'center',
                        children:[
                            {
                                title: '联系人',
                                key: 'contactor',
                                align: 'center',
                            },
                            {
                                title: '业务员',
                                key: 'salesman',
                                align: 'center',
                            },
                            {
                                title: '业务员手机',
                                key: 'salesmanTel',
                                align: 'center',
                            },
                        ]
                    },
                    {title: '客户联系方式',
                        align: 'center',
                        children:[
                            {
                                title: '电话',
                                key: 'tel',
                                align: 'center',
                            },
                            {
                                title: '联系人手机',
                                key: 'contactorTel',
                                align: 'center',
                            },
                            {
                                title: '地址',
                                key: 'streetAddress',
                                align: 'center',
                            },
                        ]
                    },
                    {title: '财务信息',
                        align: 'center',
                        children:[
                            {
                                title: '信用等级',
                                key: 'tgradeName',
                                align: 'center',
                            },
                            {
                                title: '票据类型',
                                key: 'billTypeName',
                                align: 'center',
                            },
                            {
                                title: '信誉额度',
                                key: 'creditLimit',
                                align: 'center',
                            },
                        ]
                    },
                    {title: '其他信息',
                        align: 'center',
                        children:[
                            {
                                title: '拼音',
                                key: 'pyName',
                                align: 'center',
                            },
                            {
                                title: '省份',
                                key: 'provinceName',
                                align: 'center',
                            },
                            {
                                title: '城市',
                                key: 'cityName',
                                align: 'center',
                            },
                            {
                                title: '传真',
                                key: 'fax',
                                align: 'center',
                            },
                            {
                                title: '备注',
                                key: 'remark',
                                align: 'center',
                            },
                        ]
                    },
                    {title: '操作信息',
                        align: 'center',
                        children:[
                            {
                                title: '最后操作人',
                                key: 'updateUname',
                                align: 'center',
                            },
                            {
                                title: '最后操作时间',
                                key: 'updateTime',
                                align: 'center',
                            },
                            {
                                title: '禁用',

                                align: 'center',
                                render:(h,params)=>{
                                    let text = ''
                                    params.row.isDisabled == 0 ? text='否' : text='是'
                                    return h('span' ,{} ,text)
                                }
                            },
                        ]
                    },
                ],
                managementList:[],
                moreQueryShow:false,
                clientDataShow:false,
                clientList:{},
                supplier:''//客户信息

            }
        },
        created(){
           // this.getlist()
            this.getAdress()
        },
        computed: {
            newsupplierId() {
                return this.$store.state.user.managementId;
            }
        },
        methods:{
            //获取全部表格数据
            async getlist(){
                this.loading =true
                let data = {}
                data.page = this.page.num -1
                data.size = this.page.size
                data.code = this.coding
                data.fullName = this.customerName
                data.contactorTel = this.tel
                data.lever = this.supplier.lever
                data.leverId = this.supplier.id
         let res = await getCustomerInformation(data)
                if (res.code == 0){
                    this.loading = false
                    this.managementList = res.data.content
                    this.page.total = res.data.totalElements
                }
            },
            //更多搜索
           async getQueryList(){
              let data = {}
               data = this.moreQueryOne
               let res = await getCustomerInformation(data)
               if (res.code == 0){
                   this.loading = false
                   this.managementList = res.data.content
                   this.page.total = res.data.totalElements
               }
            },
            //获取地址
            getAdress(){
                area().then(res => {
                    if(res.code == 0){
                        this.provinceArr = res.data
                    }
                })
            },
            //分页
            changePage(data){
                this.page.num = data
                    if(Object.keys(this.moreQueryOne).length == 0){
                    this.getlist()
                }else {
                    this.getQueryList()
                }
            },
            //条数
            changeSize( data){
                this.page.num = 1
                this.page.size = data
                if(Object.keys(this.moreQueryOne).length == 0){
                    this.getlist()
                }else {
                    this.getQueryList()
                }
            },
            //搜索
            queryList(){
                this.supplier=''
                this.getlist()
            },
            //打开新增客户
            addClient(){
                this.clientList ={}
                this.clientDataShow = true
            },
            //更多搜索确认
            querySure(){
                this.getQueryList()
                this.moreQueryShow = false
            },
            openMore(){
                this.moreQueryOne= {}
                this.moreQueryShow = true
            },
            //新增客户确认
            addNewClient(){
                this.$refs.child.handleSubmit( async () =>{
                    let data ={}
                    data = this.clientList
                    data.isNeedPack ? data.isNeedPack = 1 : data.isNeedPack =0
                    data.isSupplier ? data.isSupplier = 1 : data.isSupplier =0
                    data.isDisabled ? data.isDisabled = 1 : data.isDisabled =0
                    let res = await getNewClient(this.clientList)
                    if(res.code == 0){
                        this.clientDataShow =false
                        this.getlist()
                    }
                })

            },
            //获取点中的数据
            pitchOneCoustomer(currentRow){
                this.clientList = currentRow
            },
            //点击打开修改
             changeClient(){
                if (Object.keys(this.clientList).length == 0){
                    this.$Message.error('至少选择一种客户分类');
                    return false
                }
                let data = {}
                data.id = this.clientList.id
                getCustomerDetails(data).then(res => {
                    if (res.code == 0) {
                        this.clientList = res.data
                    }
                    console.log(res)
                    this.clientDataShow = true
                })
            }
        },
        watch:{
            newsupplierId:{
                handler(v,ov){
                    this.supplier = v
                    this.getlist()
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="less">
  .header-box {
    line-height: 57px;
    padding-left: 50px;
    border-bottom: 1px solid #dcdee2;
  }
  .operation {
    line-height: 40px;
    padding-left: 10px;
    /*border-bottom: 1px solid #dcdee2;*/
  }
.tabeBox {
  overflow: hidden;
  overflow-x:initial;
  height: calc(~"100% - 97px");
}
</style>
