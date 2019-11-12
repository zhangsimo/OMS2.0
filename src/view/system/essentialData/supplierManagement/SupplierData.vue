<template>
    <div style="height:100%">
      <div class="header-box">
        <span >快速查询:</span>
          <Select v-model="fasttipsType" style="width:120px" class="mr10">
            <Option v-for="item in fasttipsList" :key="item.id" :value="item.id" >{{ item.name}}</Option>
          </Select>
        <Input v-model="fasttipsTitle"  style="width: 150px" class="mr10"/>
        <span>供应商类型:</span>
        <Select v-model="supplierTypeOne" style="width:120px" class="mr10">
          <Option v-for="item in supplierType.CS00110" :key="item.itemCode" :value="item.id" >{{ item.itemName}}</Option>
        </Select>
        <Button type="warning" class="w90 mr10" @click="queryList">
              <span class="center">
                <Icon custom="iconfont iconchaxunicon icons" />查询
              </span>
        </Button>
      </div>
      <div class="operation">
        <Button class="w90 mr10" @click="addClient">
              <span class="center">
                <Icon type="md-add" />新增
              </span>
        </Button>
        <Button class="w90 mr10" @click="changeClient" >
              <span class="center">
                <Icon custom="iconfont iconbianjixiugaiicon icons" />修改
              </span>
        </Button>
      </div>
      <div class="tabeBox" >
      <div style="width: 3000px">
        <Table class="table-highlight-row"  :loading="loading" size="small" highlight-row  border :stripe="true" :columns="columns" :data="managementList" @on-current-change="pitchSupplier"></Table>
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
<!--      客户资料-->
      <Modal v-model="clientDataShow" title="供应商资料资料"  width="700">
        <ClientData :data="clientList" :provincearr="provinceArr" :treelist="treeDiagramList" ref="child"></ClientData>
        <div slot='footer'>
          <Button type='primary' @click="addNewSupplier">确定</Button>
          <Button type='default' @click='clientDataShow = false'>取消</Button>
        </div>
      </Modal>

    </div>
</template>

<script>
  import ClientData from './ClientData'
  import {getSupplierformation , getNewSupplier} from '@/api/system/essentialData/supplierManagement'
  import {area} from '@/api/lease/registerApi'
  import {getDigitalDictionary } from '@/api/system/essentialData/clientManagement'


  export default {
        name: "CustomerData",
        components:{
            ClientData
        },
      props:{
          treeDiagramList:''
      },
        data(){
            return {
                fasttipsList:[
                    {name:'供应商全称' , id:'fullName'},
                    {name:'优势品牌/产品' , id:'advantageCarbrandId'},
                    {name:'联系人电话' , id:'contactorTel'},
                ], //快速查询下拉框
                fasttipsType:'', //快速查询种类
                fasttipsTitle:'',//快速查询内容
                supplierType: '',//客户种类
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
                             title:'序号',
                             align:'center',
                             render:(h,params) =>{
                                 return h('span',{class:'table-radio'})
                             }
                         },
                         {
                             title: '供应商简称',
                             key: 'shortName',
                             align: 'center',
                         },
                         {
                             title: '供应商全称',
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
                                title: '职务',
                                key: 'salesmanDutyName',
                                align: 'center',
                            },
                            {
                                title: '联系人手机',
                                key: 'contactorTel',
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
                    {title: '财务信息',
                        align: 'center',
                        children:[
                            // {
                            //     title: '信誉等级',
                            //     key: 'tel',
                            //     align: 'center',
                            // },
                            // {
                            //     title: '信誉额度',
                            //     key: 'contactorTel',
                            //     align: 'center',
                            // },
                            {
                                title: '票据类型',
                                key: 'billTypeName',
                                align: 'center',
                            },
                            {
                                title: '结算方式',
                                key: 'settTypeName',
                                align: 'center',
                            },
                        ]
                    },
                    {title: '其他信息',
                        align: 'center',
                        children:[
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
                                title: '电话',
                                key: 'tel',
                                align: 'center',
                            },
                            {
                                title: '供应商类型',
                                key: 'supplierTypeName',
                                align: 'center',
                            },
                            {
                                title: '优势品牌/产品',
                                key: 'advantageCarbrandId',
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
                            {
                                title: '供应商编码',
                                key: 'code',
                                align: 'center',
                            }
                        ]
                    },
                ],
                managementList:[],
                clientDataShow:false,
                clientList:{},
                supplierTypeOne: '', //供应商类型
                pitchSupplierOne:'',
                supplier:''
            }
        },
        created(){
           // this.getlist()
            this.getAdress()
           this.getsupplierTypeList()
        },
      computed: {
          newsupplierId() {
              return this.$store.state.user.supplierId;
          }
      },
        methods:{
            //获取全部表格数据
            async getlist(){
                this.loading =true
                let data = {}
                let type = this.salesmanDuty || ''
                data.page = this.page.num - 1
                data.size = this.page.size
                // this.$set(data,this.salesmanDuty,this.fasttipsTitle)
                data[this.fasttipsType] = this.fasttipsTitle
                data.supplierType = this.supplierTypeOne
                data.supplierTypeFirst = this.supplier.id
         let res = await getSupplierformation(data)
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
                    this.getlist()
            },
            //条数
            changeSize( data){
                this.page.num = 1
                this.page.size = data
                    this.getlist()
            },
            //数字字典
            async  getsupplierTypeList(){
                let data ={}
                data =['CS00110']
                let res = await  getDigitalDictionary(data)
                if(res.code == 0){
                    this.supplierType = res.data
                }

            },
            //搜索
            queryList(){
                this.getlist()
            },
            //选中一条信息
            pitchSupplier(currentRow){
                this.pitchSupplierOne = currentRow
            },
            addClient(){
                this.clientList ={}
               this.clientDataShow = true
            },
            //确认添加一条信息
            addNewSupplier(){
                this.$refs.child.handleSubmit( async () => {
                    let data = this.clientList
                    data.isDisabled ? data.isDisabled = 1 : data.isDisabled = 0
                    data.isClient ? data.isClient =1 : data.isClient = 0
                    let res = await  getNewSupplier(data)
                    this.clientDataShow = false
                })
            },
            //修改客户资料
            changeClient(){
                if (Object.keys(this.pitchSupplierOne).length == 0  ){
                    this.$Message.error('至少选项一条地址')
                    return false
                }
                this.pitchSupplierOne.isDisabled == 1? this.pitchSupplierOne.isDisabled = true : this.pitchSupplierOne.isDisabled = false
                this.pitchSupplierOne.isClient == 1? this.pitchSupplierOne.isClient = true : this.pitchSupplierOne.isClient = false
                this.clientList =this.pitchSupplierOne
                this.clientDataShow = true
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
    padding-left: 20px;
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
